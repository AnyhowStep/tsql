import * as tm from "type-mapping";
import {ITable} from "../table";

/**
 * Represents a row of the table, when retrieved from the database.
 *
 * Assumes `TableT` is not a union.
 */
export type Row<TableT extends ITable> = (
    {
        readonly [columnAlias in Extract<keyof TableT["columns"], string>] : (
            tm.OutputOf<TableT["columns"][columnAlias]["mapper"]>
        )
    }
);
