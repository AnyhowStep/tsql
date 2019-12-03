import {ITable} from "../../table";

export type ExtractWithColumnAlias<TableT extends ITable, ColumnAliasT extends string> =
    TableT extends ITable ?
    (
        ColumnAliasT extends keyof TableT["columns"] ?
        TableT :
        never
    ) :
    never
;
