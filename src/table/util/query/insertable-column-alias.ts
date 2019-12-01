import {ITable} from "../../table";
import {ColumnMapUtil} from "../../../column-map";
import {columnAlias} from "./column-alias";

export type InsertableColumnAlias<TableT extends ITable> =
    Exclude<
        ColumnMapUtil.ColumnAlias<TableT["columns"]>,
        (
            TableT["generatedColumns"][number]
        )
    >
;

export function isInsertableColumnAlias<TableT extends ITable> (
    table : TableT,
    columnAlias : string
) : columnAlias is InsertableColumnAlias<TableT> {
    return (
        Object.prototype.hasOwnProperty.call(table.columns, columnAlias) &&
        Object.prototype.propertyIsEnumerable.call(table.columns, columnAlias) &&
        table.generatedColumns.indexOf(columnAlias) < 0
    );
}
export function insertableColumnAlias<TableT extends ITable> (
    table : TableT
) : InsertableColumnAlias<TableT>[] {
    return (columnAlias(table) as string[]).filter<InsertableColumnAlias<TableT>>(
        (columnAlias) : columnAlias is InsertableColumnAlias<TableT> => (
            isInsertableColumnAlias(table, columnAlias)
        )
    );
}
