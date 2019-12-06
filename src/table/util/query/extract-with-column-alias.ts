import {ITable} from "../../table";

export type ExtractWithColumnAlias<TableT extends ITable, ColumnAliasT extends string> =
    TableT extends ITable ?
    (
        ColumnAliasT extends Extract<keyof TableT["columns"], string> ?
        TableT :
        never
    ) :
    never
;
