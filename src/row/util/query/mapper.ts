import * as tm from "type-mapping";
import {TableWithPrimaryKey} from "../../../table";
import {ColumnMapUtil} from "../../../column-map";
import {Row_Output} from "../../row";

export type Mapper<TableT extends Pick<TableWithPrimaryKey, "columns">> = (
    tm.SafeMapper<Row_Output<TableT>>
);
export function mapper<TableT extends Pick<TableWithPrimaryKey, "columns">> (
    table : TableT
) : (
    Mapper<TableT>
) {
    return ColumnMapUtil.mapper(
        table.columns
    ) as any;
}
