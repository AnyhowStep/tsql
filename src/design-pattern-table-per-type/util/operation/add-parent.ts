import {ITablePerType} from "../../table-per-type";
import {ITable, TableUtil} from "../../../table";
import {ExtractParentTables, ExtractChildTable, extractParentTables, extractChildTable, ColumnAlias} from "../query";
import {TablePerType} from "../../table-per-type-impl";
import {removeDuplicateParents} from "./remove-duplicate-parents";
import {isTablePerType} from "../predicate";

type ExtractAutoIncrement<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    T["autoIncrement"][number] :
    Extract<T["autoIncrement"], string>
;

type ExtractExplicitAutoIncrementValueEnabled<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    T["explicitAutoIncrementValueEnabled"][number] :
    T extends ITable ?
    TableUtil.ExplicitAutoIncrement<T> :
    never
;

type ExtractColumnAlias<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    ColumnAlias<T> :
    T extends ITable ?
    TableUtil.ColumnAlias<T> :
    never
;

type AddParentAutoIncrement<
    TablePerTypeT extends ITablePerType,
    ParentTableT extends ITable|ITablePerType
> =
    | ExtractAutoIncrement<ParentTableT>
    | Exclude<
        TablePerTypeT["autoIncrement"][number],
        ExtractColumnAlias<ParentTableT>
    >
;

type AddParentExplicitAutoIncrementValueEnabled<
    TablePerTypeT extends ITablePerType,
    ParentTableT extends ITable|ITablePerType
> =
    | Extract<
        ExtractExplicitAutoIncrementValueEnabled<ParentTableT>,
        TablePerTypeT["explicitAutoIncrementValueEnabled"][number]
    >
    | Exclude<
        ExtractExplicitAutoIncrementValueEnabled<ParentTableT>,
        TablePerTypeT["autoIncrement"][number]
    >
    | Exclude<
        TablePerTypeT["explicitAutoIncrementValueEnabled"][number],
        ExtractAutoIncrement<ParentTableT>
    >
;

export type AddParent<
    TablePerTypeT extends ITablePerType,
    ParentTableT extends ITable|ITablePerType
> =
    TablePerType<{
        childTable : TablePerTypeT["childTable"],
        parentTables : readonly (
            | TablePerTypeT["parentTables"][number]
            | ExtractParentTables<ParentTableT>
            | ExtractChildTable<ParentTableT>
        )[],
        autoIncrement : readonly AddParentAutoIncrement<
            TablePerTypeT,
            ParentTableT
        >[],
        explicitAutoIncrementValueEnabled : readonly AddParentExplicitAutoIncrementValueEnabled<
            TablePerTypeT,
            ParentTableT
        >[],
    }>
;

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
            /**
             * @todo
             */
            autoIncrement : null as any,
            /**
             * @todo
             */
            explicitAutoIncrementValueEnabled : null as any,
        },
        joins
    );
}
