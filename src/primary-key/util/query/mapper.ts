import * as tm from "type-mapping";
import {PrimaryKey_Output} from "../../primary-key";
import {TableWithPrimaryKey} from "../../../table";
import {ColumnMapUtil} from "../../../column-map";
import {pickOwnEnumerable} from "../../../type-util";

export type Mapper<TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">> = (
    tm.SafeMapper<PrimaryKey_Output<TableT>>
);
export function mapper<TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">> (
    table : TableT
) : (
    Mapper<TableT>
) {
    return ColumnMapUtil.mapper(
        pickOwnEnumerable(table.columns, table.primaryKey)
    ) as any;
}
