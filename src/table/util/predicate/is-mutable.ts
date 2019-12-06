import {ITable} from "../../table";

/**
 * Assumes `TableT` may be a union type
 */
export type IsMutable<TableT extends ITable, ColumnAliasT extends string> =
    TableT extends ITable ?
    (
        ColumnAliasT extends TableT["mutableColumns"][number] ?
        true :
        false
    ) :
    never
;
