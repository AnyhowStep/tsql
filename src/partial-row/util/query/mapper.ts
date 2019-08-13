import * as tm from "type-mapping";
import {TableWithPrimaryKey} from "../../../table";
import {ColumnMapUtil} from "../../../column-map";
import {PartialRow_Output} from "../../partial-row";

export type Mapper<TableT extends Pick<TableWithPrimaryKey, "columns">> = (
    tm.SafeMapper<PartialRow_Output<TableT>>
);
export function mapper<TableT extends Pick<TableWithPrimaryKey, "columns">> (
    table : TableT
) : (
    Mapper<TableT>
) {
    return ColumnMapUtil.partialMapper(
        table.columns
    ) as any;
}
