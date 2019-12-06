import {ITable} from "../../table";

/**
 * Assumes `TableT` may be a union type
 */
export type HasExplicitDefaultValue<TableT extends ITable, ColumnAliasT extends string> =
    TableT extends ITable ?
    (
        ColumnAliasT extends TableT["explicitDefaultValueColumns"][number] ?
        true :
        false
    ) :
    never
;
