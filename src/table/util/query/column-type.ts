import {ITable} from "../../table";

export type ColumnType<
    TableT extends ITable,
    ColumnAliasT extends string
> =
    ReturnType<TableT["columns"][ColumnAliasT]["mapper"]>
;
