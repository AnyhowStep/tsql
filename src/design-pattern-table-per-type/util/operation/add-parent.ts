import {ITablePerType} from "../../table-per-type";
import {ITable, TableUtil} from "../../../table";
import {ExtractParentTables, ExtractChildTable, extractParentTables, extractChildTable, ColumnAlias, columnAliases} from "../query";
import {TablePerType} from "../../table-per-type-impl";
import {removeDuplicateParents} from "./remove-duplicate-parents";
import {isTablePerType} from "../predicate";
import {KeyUtil} from "../../../key";

type ExtractAutoIncrement<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    T["autoIncrement"][number] :
    Extract<T["autoIncrement"], string>
;

function extractAutoIncrement<
    T extends ITable|ITablePerType
> (t : T) : ExtractAutoIncrement<T>[] {
    if (isTablePerType(t)) {
        return [...t.autoIncrement] as ExtractAutoIncrement<T>[];
    } else {
        return (
            t.autoIncrement == undefined ?
            [] :
            [t.autoIncrement]
        ) as ExtractAutoIncrement<T>[];
    }
}

type ExtractExplicitAutoIncrementValueEnabled<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    T["explicitAutoIncrementValueEnabled"][number] :
    T extends ITable ?
    TableUtil.ExplicitAutoIncrement<T> :
    never
;

function extractExplicitAutoIncrementValueEnabled<
    T extends ITable|ITablePerType
> (t : T) : ExtractExplicitAutoIncrementValueEnabled<T>[] {
    if (isTablePerType(t)) {
        return [...t.explicitAutoIncrementValueEnabled] as ExtractExplicitAutoIncrementValueEnabled<T>[];
    } else if (TableUtil.isTable(t)) {
        return (
            t.autoIncrement == undefined ?
            [] :
            //eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            t.explicitAutoIncrementValueEnabled ?
            [t.autoIncrement] :
            []
        ) as ExtractExplicitAutoIncrementValueEnabled<T>[];
    } else {
        throw new Error(`Expected ITable or ITablePerType`);
    }
}

type ExtractColumnAlias<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    ColumnAlias<T> :
    T extends ITable ?
    TableUtil.ColumnAlias<T> :
    never
;

function extractColumnAlias<
    T extends ITable|ITablePerType
> (t : T) : ExtractColumnAlias<T>[] {
    if (isTablePerType(t)) {
        return columnAliases(t) as string[] as ExtractColumnAlias<T>[];
    } else if (TableUtil.isTable(t)) {
        return TableUtil.columnAlias(t) as string[] as ExtractColumnAlias<T>[];
    } else {
        throw new Error(`Expected ITable or ITablePerType`);
    }
}

type AddParentAutoIncrement<
    TablePerTypeT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> =
    | ExtractAutoIncrement<ParentT>
    | Exclude<
        TablePerTypeT["autoIncrement"][number],
        ExtractColumnAlias<ParentT>
    >
;

function addParentAutoIncrement<
    TablePerTypeT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> (
    tpt : TablePerTypeT,
    parent : ParentT
) : AddParentAutoIncrement<TablePerTypeT, ParentT>[] {
    const parentColumnAliases = extractColumnAlias(parent);
    return KeyUtil.removeDuplicates([
        ...extractAutoIncrement(parent),
        ...tpt.autoIncrement.filter(
            columnAlias => !parentColumnAliases.includes(columnAlias as any)
        ),
    ]) as AddParentAutoIncrement<TablePerTypeT, ParentT>[];
}

type AddParentExplicitAutoIncrementValueEnabled<
    TablePerTypeT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> =
    | Extract<
        ExtractExplicitAutoIncrementValueEnabled<ParentT>,
        TablePerTypeT["explicitAutoIncrementValueEnabled"][number]
    >
    | Exclude<
        ExtractExplicitAutoIncrementValueEnabled<ParentT>,
        TablePerTypeT["autoIncrement"][number]
    >
    | Exclude<
        TablePerTypeT["explicitAutoIncrementValueEnabled"][number],
        ExtractColumnAlias<ParentT>
    >
;

function addParentExplicitAutoIncrementValueEnabled<
    TablePerTypeT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> (
    tpt : TablePerTypeT,
    parent : ParentT
) : AddParentExplicitAutoIncrementValueEnabled<TablePerTypeT, ParentT>[] {
    const parentColumnAliases = extractColumnAlias(parent);

    return KeyUtil.removeDuplicates([
        ...extractExplicitAutoIncrementValueEnabled(parent).filter(
            columnAlias => (
                tpt.explicitAutoIncrementValueEnabled.includes(columnAlias) ||
                !tpt.autoIncrement.includes(columnAlias)
            )
        ),
        ...tpt.explicitAutoIncrementValueEnabled.filter(
            columnAlias => !parentColumnAliases.includes(columnAlias as any)
        ),
    ]) as AddParentExplicitAutoIncrementValueEnabled<TablePerTypeT, ParentT>[];
}

export type AddParent<
    TablePerTypeT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> =
    TablePerType<{
        childTable : TablePerTypeT["childTable"],
        parentTables : readonly (
            | TablePerTypeT["parentTables"][number]
            | ExtractParentTables<ParentT>
            | ExtractChildTable<ParentT>
        )[],
        autoIncrement : readonly AddParentAutoIncrement<
            TablePerTypeT,
            ParentT
        >[],
        explicitAutoIncrementValueEnabled : readonly AddParentExplicitAutoIncrementValueEnabled<
            TablePerTypeT,
            ParentT
        >[],
    }>
;

/**
 * @todo Check that a column is not both auto-increment and generated at the same time
 *
 * @todo Check that `tpt.childTable` can join to `parent.childTable` using `parent.childTable`'s primary key
 *
 * @todo Check that columns have compatible types; must be assigble from child to parent
 *       Example: child.type = "red"|"blue", parent.type = "red"|"blue"|"green"
 *
 * @todo Check that inheritance is not circular
 *       Example: `Animal` cannot be a child of `Animal`.
 *       Example: This is invalid: `Dog extends Animal extends Mammal extends Dog`
 */
export function addParent<
    TptT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> (
    tpt : TptT,
    parent : ParentT
) : (
    AddParent<TptT, ParentT>
) {
    let joins : ITablePerType["joins"] | undefined = undefined;
    if (TableUtil.isTable(parent)) {
        joins = [
            ...tpt.joins,
            [
                tpt.childTable.alias,
                parent.alias,
            ],
        ];
    } else if (isTablePerType(parent)) {
        joins = [
            ...tpt.joins,
            ...parent.joins,
            [
                tpt.childTable.alias,
                parent.childTable.alias,
            ],
        ];
    } else {
        throw new Error(`Expected ITable or ITablePerType for parent`);
    }
    return new TablePerType<{
        childTable : TptT["childTable"],
        parentTables : readonly (
            | TptT["parentTables"][number]
            | ExtractParentTables<ParentT>
            | ExtractChildTable<ParentT>
        )[],
        autoIncrement : readonly AddParentAutoIncrement<
            TptT,
            ParentT
        >[],
        explicitAutoIncrementValueEnabled : readonly AddParentExplicitAutoIncrementValueEnabled<
            TptT,
            ParentT
        >[],
    }>(
        {
            childTable : tpt.childTable,
            parentTables : removeDuplicateParents([
                ...tpt.parentTables,
                ...extractParentTables(parent),
                extractChildTable(parent),
            ]),
            autoIncrement : addParentAutoIncrement(tpt, parent),
            explicitAutoIncrementValueEnabled : addParentExplicitAutoIncrementValueEnabled(tpt, parent),
        },
        joins
    );
}
