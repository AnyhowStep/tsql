import {ITablePerType} from "../../table-per-type";
import {ITable, TableUtil, TableWithPrimaryKey} from "../../../table";
import {
    ExtractAutoIncrement,
    extractAutoIncrement,
    ExtractColumnAlias,
    extractColumnAliases,
    ExtractExplicitAutoIncrementValueEnabled,
    extractExplicitAutoIncrementValueEnabled,
    ExtractInsertAndFetchPrimaryKey,
    extractInsertAndFetchPrimaryKey,
    ExtractAllTables,
    extractAllTables,
} from "../query";
import {TablePerType} from "../../table-per-type-impl";
import {removeDuplicateParents} from "./remove-duplicate-parents";
import {isTablePerType} from "../predicate";
import {KeyUtil} from "../../../key";
import {Identity} from "../../../type-util";

/**
 * + `ParentT["parentTables"]`
 * + `ParentT["childTable"]`
 * + `Tpt["parentTables"]`
 * + `Tpt["childTable"]`
 *
 * Before:
 * ```
 * C1 -> P1
 * ```
 *
 * After:
 * ```
 * C1 -> P1 -> C2 -> P2
 * ```
 */
type AddParent_AutoIncrement<
    TptT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> =
    Identity<
        | ExtractAutoIncrement<ParentT>
        | Exclude<
            TptT["autoIncrement"][number],
            ExtractColumnAlias<ParentT>
        >
    >
;

function addParent_AutoIncrement<
    TptT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> (
    tpt : TptT,
    parent : ParentT
) : AddParent_AutoIncrement<TptT, ParentT>[] {
    const parentColumnAliases = extractColumnAliases(parent);
    return KeyUtil.removeDuplicates([
        ...extractAutoIncrement(parent),
        ...tpt.autoIncrement.filter(
            columnAlias => !parentColumnAliases.includes(columnAlias as any)
        ),
    ]) as AddParent_AutoIncrement<TptT, ParentT>[];
}

type AddParent_ExplicitAutoIncrementValueEnabled<
    TptT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> =
    Identity<
        | Extract<
            ExtractExplicitAutoIncrementValueEnabled<ParentT>,
            TptT["explicitAutoIncrementValueEnabled"][number]
        >
        | Exclude<
            ExtractExplicitAutoIncrementValueEnabled<ParentT>,
            TptT["autoIncrement"][number]
        >
        | Exclude<
            TptT["explicitAutoIncrementValueEnabled"][number],
            ExtractColumnAlias<ParentT>
        >
    >
;

function addParent_ExplicitAutoIncrementValueEnabled<
    TptT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> (
    tpt : TptT,
    parent : ParentT
) : AddParent_ExplicitAutoIncrementValueEnabled<TptT, ParentT>[] {
    const parentColumnAliases = extractColumnAliases(parent);

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
    ]) as AddParent_ExplicitAutoIncrementValueEnabled<TptT, ParentT>[];
}

type AddParent_InsertAndFetchPrimaryKey<
    TptT extends ITablePerType,
    ParentT extends TableWithPrimaryKey|ITablePerType
> =
    Identity<
        | ExtractInsertAndFetchPrimaryKey<ParentT>
        | Exclude<
            TptT["insertAndFetchPrimaryKey"][number],
            ExtractColumnAlias<ParentT>
        >
    >
;

function addParent_InsertAndFetchPrimaryKey<
    TptT extends ITablePerType,
    ParentT extends TableWithPrimaryKey|ITablePerType
> (
    tpt : TptT,
    parent : ParentT
) : AddParent_InsertAndFetchPrimaryKey<TptT, ParentT>[] {
    const parentColumnAliases = extractColumnAliases(parent);
    return KeyUtil.removeDuplicates([
        ...extractInsertAndFetchPrimaryKey(parent),
        ...tpt.autoIncrement.filter(
            columnAlias => !parentColumnAliases.includes(columnAlias as any)
        ),
    ]) as AddParent_InsertAndFetchPrimaryKey<TptT, ParentT>[];
}

export type AddParent<
    TptT extends ITablePerType,
    ParentT extends TableWithPrimaryKey|ITablePerType
> =
    TablePerType<{
        childTable : TptT["childTable"],
        parentTables : readonly (
            | ExtractAllTables<ParentT>
            | TptT["parentTables"][number]
        )[],
        autoIncrement : readonly AddParent_AutoIncrement<
            TptT,
            ParentT
        >[],
        explicitAutoIncrementValueEnabled : readonly AddParent_ExplicitAutoIncrementValueEnabled<
            TptT,
            ParentT
        >[],
        insertAndFetchPrimaryKey : readonly AddParent_InsertAndFetchPrimaryKey<
            TptT,
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
    ParentT extends TableWithPrimaryKey|ITablePerType
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
            | ExtractAllTables<ParentT>
            | TptT["parentTables"][number]
        )[],
        autoIncrement : readonly AddParent_AutoIncrement<
            TptT,
            ParentT
        >[],
        explicitAutoIncrementValueEnabled : readonly AddParent_ExplicitAutoIncrementValueEnabled<
            TptT,
            ParentT
        >[],
        insertAndFetchPrimaryKey : readonly AddParent_InsertAndFetchPrimaryKey<
            TptT,
            ParentT
        >[],
    }>(
        {
            childTable : tpt.childTable,
            parentTables : removeDuplicateParents([
                ...extractAllTables(parent),
                ...tpt.parentTables,
            ]),
            autoIncrement : addParent_AutoIncrement(tpt, parent),
            explicitAutoIncrementValueEnabled : addParent_ExplicitAutoIncrementValueEnabled(tpt, parent),
            insertAndFetchPrimaryKey : addParent_InsertAndFetchPrimaryKey(tpt, parent),
        },
        joins
    );
}
