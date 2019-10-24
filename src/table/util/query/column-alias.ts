import {ITable} from "../../table";
import {ColumnMapUtil} from "../../../column-map";

export type ColumnAlias<TableT extends ITable> =
    ColumnMapUtil.ColumnAlias<TableT["columns"]>
;
export function columnAlias<TableT extends ITable> (
    table : TableT
) : ColumnAlias<TableT>[] {
    return ColumnMapUtil.columnAlias<
        TableT["columns"]
    >(table.columns);
}
