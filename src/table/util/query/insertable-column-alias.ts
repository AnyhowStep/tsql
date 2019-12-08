import {ITable} from "../../table";
import {ColumnMapUtil} from "../../../column-map";
import {columnAlias} from "./column-alias";
import {ImplicitAutoIncrement, isImplicitAutoIncrement} from "./explicit-auto-increment";

export type InsertableColumnAlias<TableT extends ITable> =
    Exclude<
        ColumnMapUtil.ColumnAlias<TableT["columns"]>,
        (
            | TableT["generatedColumns"][number]
            | ImplicitAutoIncrement<TableT>
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
        !table.generatedColumns.includes(columnAlias) &&
        !isImplicitAutoIncrement(table, columnAlias)
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
