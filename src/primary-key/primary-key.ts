import {TableWithPrimaryKey} from "../table";
import {TypeMapUtil} from "../type-map";

export type PrimaryKey<TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey">> = (
    TableT extends Pick<TableWithPrimaryKey, "columns"|"primaryKey"> ?
    TypeMapUtil.FromColumnMap<
        Pick<TableT["columns"], TableT["primaryKey"][number]>
    > :
    never
);
