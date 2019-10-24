import {ITable} from "../../table";
import {ColumnMapUtil} from "../../../column-map";
import {columnAlias} from "./column-alias";

export type RequiredColumnAlias<TableT extends ITable> =
    Exclude<
        ColumnMapUtil.ColumnAlias<TableT["columns"]>,
        (
            TableT["generatedColumns"][number] |
            TableT["nullableColumns"][number] |
            TableT["explicitDefaultValueColumns"][number]
        )
    >
;

export function isRequiredColumnAlias<TableT extends ITable> (
    table : TableT,
    columnAlias : string
) : columnAlias is RequiredColumnAlias<TableT> {
    return (
        Object.prototype.hasOwnProperty.call(table.columns, columnAlias) &&
        Object.prototype.propertyIsEnumerable.call(table.columns, columnAlias) &&
        table.generatedColumns.indexOf(columnAlias) < 0 &&
        table.nullableColumns.indexOf(columnAlias) < 0 &&
        table.explicitDefaultValueColumns.indexOf(columnAlias) < 0
    );
}
export function requiredColumnAlias<TableT extends ITable> (
    table : TableT
) : RequiredColumnAlias<TableT>[] {
    return (columnAlias(table) as string[]).filter<RequiredColumnAlias<TableT>>(
        (columnAlias) : columnAlias is RequiredColumnAlias<TableT> => (
            isRequiredColumnAlias(table, columnAlias)
        )
    );
}
