import {ITablePerType} from "../../table-per-type";
import {ITable, TableUtil} from "../../../table";
import {ExtractParentTables, ExtractChildTable, extractParentTables, extractChildTable} from "../query";
import {TablePerType} from "../../table-per-type-impl";
import {removeDuplicateParents} from "./remove-duplicate-parents";
import {isTablePerType} from "../predicate";

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
    }>(
        {
            childTable : tpt.childTable,
            parentTables : removeDuplicateParents([
                ...tpt.parentTables,
                ...extractParentTables(parent),
                extractChildTable(parent),
            ]),
        },
        joins
    );
}
