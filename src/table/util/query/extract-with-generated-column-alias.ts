import {ITable} from "../../table";

export type ExtractWithGeneratedColumnAlias<TableT extends ITable, ColumnAliasT extends string> =
    TableT extends ITable ?
    (
        ColumnAliasT extends TableT["generatedColumns"][number] ?
        TableT :
        never
    ) :
    never
;
