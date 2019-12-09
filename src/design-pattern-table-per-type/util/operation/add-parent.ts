import {ITablePerType} from "../../table-per-type";
import {ITable, TableUtil, TableWithAutoIncrement} from "../../../table";
import {ExtractParentTables, ExtractChildTable, extractParentTables, extractChildTable, ColumnAlias, columnAliases} from "../query";
import {TablePerType} from "../../table-per-type-impl";
import {removeDuplicateParents} from "./remove-duplicate-parents";
import {isTablePerType} from "../predicate";
import {KeyUtil, Key} from "../../../key";
import {Identity} from "../../../type-util";

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

function addParentAutoIncrement<
    TptT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> (
    tpt : TptT,
    parent : ParentT
) : AddParentAutoIncrement<TptT, ParentT>[] {
    const parentColumnAliases = extractColumnAlias(parent);
    return KeyUtil.removeDuplicates([
        ...extractAutoIncrement(parent),
        ...tpt.autoIncrement.filter(
            columnAlias => !parentColumnAliases.includes(columnAlias as any)
        ),
    ]) as AddParentAutoIncrement<TptT, ParentT>[];
}

type AddParentExplicitAutoIncrementValueEnabled<
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

function addParentExplicitAutoIncrementValueEnabled<
    TptT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> (
    tpt : TptT,
    parent : ParentT
) : AddParentExplicitAutoIncrementValueEnabled<TptT, ParentT>[] {
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
    ]) as AddParentExplicitAutoIncrementValueEnabled<TptT, ParentT>[];
}

export type AddParent<
    TptT extends ITablePerType,
    ParentT extends ITable|ITablePerType
> =
    TablePerType<{
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
        childInsertAndFetchCandidateKeys : (
            TptT["childInsertAndFetchCandidateKeys"] extends undefined ?
            undefined :
            TptT["childInsertAndFetchCandidateKeys"] extends readonly never[] ?
            readonly never[] :
            TptT["childInsertAndFetchCandidateKeys"] extends readonly Key[] ?
            (
                KeyUtil.SubtractDistribute<
                    TptT["childInsertAndFetchCandidateKeys"][number],
                    readonly ExtractColumnAlias<ParentT>[]
                > extends readonly never[] ?
                undefined :
                readonly KeyUtil.SubtractDistribute<
                    TptT["childInsertAndFetchCandidateKeys"][number],
                    readonly ExtractColumnAlias<ParentT>[]
                >[]
            ) :
            never
        ),
        parentInsertAndFetchCandidateKeys : (
            ParentT extends ITablePerType ?
            (
                ParentT["childInsertAndFetchCandidateKeys"] extends undefined ?
                (
                    ParentT["parentInsertAndFetchCandidateKeys"] extends undefined ?
                    undefined :
                    ParentT["parentInsertAndFetchCandidateKeys"] extends readonly never[] ?
                    readonly never[] :
                    ParentT["parentInsertAndFetchCandidateKeys"] extends readonly Key[] ?
                    readonly (
                        Extract<
                            ParentT["parentInsertAndFetchCandidateKeys"],
                            readonly Key[]
                        >[number]
                    )[] :
                    never
                ) :
                ParentT["childInsertAndFetchCandidateKeys"] extends readonly never[] ?
                readonly never[] :
                ParentT["childInsertAndFetchCandidateKeys"] extends readonly Key[] ?
                (
                    ParentT["parentInsertAndFetchCandidateKeys"] extends undefined ?
                    readonly (
                        Extract<
                            ParentT["childInsertAndFetchCandidateKeys"],
                            readonly Key[]
                        >[number]
                    )[] :
                    ParentT["parentInsertAndFetchCandidateKeys"] extends readonly never[] ?
                    readonly never[] :
                    ParentT["parentInsertAndFetchCandidateKeys"] extends readonly Key[] ?
                    readonly KeyUtil.ConcatDistribute<
                        KeyUtil.SubtractDistribute<
                            Extract<
                                ParentT["childInsertAndFetchCandidateKeys"],
                                readonly Key[]
                            >[number],
                            readonly ExtractColumnAlias<ParentT>[]
                        >,
                        Extract<
                            ParentT["parentInsertAndFetchCandidateKeys"],
                            readonly Key[]
                        >[number]
                    >[] :
                    never
                ) :
                never
            ) :
            ParentT extends ITable ?
            (
                ParentT extends TableWithAutoIncrement ?
                undefined :
                readonly (ParentT["candidateKeys"][number])[]
            ) :
            never
        ),
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
        childInsertAndFetchCandidateKeys : (
            TptT["childInsertAndFetchCandidateKeys"] extends undefined ?
            undefined :
            TptT["childInsertAndFetchCandidateKeys"] extends readonly never[] ?
            readonly never[] :
            TptT["childInsertAndFetchCandidateKeys"] extends readonly Key[] ?
            (
                KeyUtil.SubtractDistribute<
                    TptT["childInsertAndFetchCandidateKeys"][number],
                    readonly ExtractColumnAlias<ParentT>[]
                > extends readonly never[] ?
                undefined :
                readonly KeyUtil.SubtractDistribute<
                    TptT["childInsertAndFetchCandidateKeys"][number],
                    readonly ExtractColumnAlias<ParentT>[]
                >[]
            ) :
            never
        ),
        parentInsertAndFetchCandidateKeys : (
            ParentT extends ITablePerType ?
            (
                ParentT["childInsertAndFetchCandidateKeys"] extends undefined ?
                (
                    ParentT["parentInsertAndFetchCandidateKeys"] extends undefined ?
                    undefined :
                    ParentT["parentInsertAndFetchCandidateKeys"] extends readonly never[] ?
                    readonly never[] :
                    ParentT["parentInsertAndFetchCandidateKeys"] extends readonly Key[] ?
                    readonly (
                        Extract<
                            ParentT["parentInsertAndFetchCandidateKeys"],
                            readonly Key[]
                        >[number]
                    )[] :
                    never
                ) :
                ParentT["childInsertAndFetchCandidateKeys"] extends readonly never[] ?
                readonly never[] :
                ParentT["childInsertAndFetchCandidateKeys"] extends readonly Key[] ?
                (
                    ParentT["parentInsertAndFetchCandidateKeys"] extends undefined ?
                    readonly (
                        Extract<
                            ParentT["childInsertAndFetchCandidateKeys"],
                            readonly Key[]
                        >[number]
                    )[] :
                    ParentT["parentInsertAndFetchCandidateKeys"] extends readonly never[] ?
                    readonly never[] :
                    ParentT["parentInsertAndFetchCandidateKeys"] extends readonly Key[] ?
                    readonly KeyUtil.ConcatDistribute<
                        KeyUtil.SubtractDistribute<
                            Extract<
                                ParentT["childInsertAndFetchCandidateKeys"],
                                readonly Key[]
                            >[number],
                            readonly ExtractColumnAlias<ParentT>[]
                        >,
                        Extract<
                            ParentT["parentInsertAndFetchCandidateKeys"],
                            readonly Key[]
                        >[number]
                    >[] :
                    never
                ) :
                never
            ) :
            ParentT extends ITable ?
            (
                ParentT extends TableWithAutoIncrement ?
                undefined :
                readonly (ParentT["candidateKeys"][number])[]
            ) :
            never
        ),
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
            /**
             * @todo
             */
            childInsertAndFetchCandidateKeys : null as any,
            /**
             * @todo
             */
            parentInsertAndFetchCandidateKeys : null as any,
        },
        joins
    );
}
