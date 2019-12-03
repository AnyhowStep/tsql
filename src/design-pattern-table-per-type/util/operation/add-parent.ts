import {ITablePerType} from "../../table-per-type";
import {ITable} from "../../../table";
import {ExtractParentTables, ExtractChildTable, extractParentTables, extractChildTable} from "../query";
import {TablePerType} from "../../table-per-type-impl";

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
    TablePerTypeT extends ITablePerType,
    ParentTableT extends ITable|ITablePerType
> (
    tablePerType : TablePerTypeT,
    parentTable : ParentTableT
) : (
    AddParent<TablePerTypeT, ParentTableT>
) {
    return new TablePerType({
        childTable : tablePerType.childTable,
        parentTables : [
            ...tablePerType.parentTables,
            ...extractParentTables(parentTable),
            extractChildTable(parentTable),
        ],
    });
}
