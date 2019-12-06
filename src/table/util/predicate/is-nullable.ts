import {ITable} from "../../table";

/**
 * Assumes `TableT` may be a union type
 */
export type IsNullable<TableT extends ITable, ColumnAliasT extends string> =
    TableT extends ITable ?
    (
        ColumnAliasT extends TableT["nullableColumns"][number] ?
        true :
        false
    ) :
    never
;
