import {ITable} from "../../table";
import {ColumnMapUtil} from "../../../column-map";

export type ColumnAlias<TableT extends Pick<ITable, "columns">> =
    ColumnMapUtil.ColumnAlias<TableT["columns"]>
;
/**
 * @todo Pluralize this and others where relevant?
 * Be more consistent with pluralization.
 */
export function columnAlias<TableT extends ITable> (
    table : TableT
) : ColumnAlias<TableT>[] {
    return ColumnMapUtil.columnAlias<
        TableT["columns"]
    >(table.columns);
}
