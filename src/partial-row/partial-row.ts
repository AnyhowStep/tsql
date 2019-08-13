import * as tm from "type-mapping";
import {ITable} from "../table";

/**
 * Represents a partial row of the table, when retrieved from the database.
 *
 * -----
 *
 * Assumes `TableT` is not a union.
 *
 * If it is a union, use `PartialRow_Output/Input<U>` instead.
 *
 * -----
 *
 * Also assumes `TableT["columns"]` are not unions.
 * They really shouldn't be unions.
 * + Why does your table not have a definite set of columns?
 *   Is it Schrödinger's columns?
 */
export type PartialRow_NonUnion<TableT extends Pick<ITable, "columns">> = (
    {
        readonly [columnAlias in Extract<keyof TableT["columns"], string>]? : (
            tm.OutputOf<TableT["columns"][columnAlias]["mapper"]>
        )
    }
);

/**
 * Represents a partial row of the table, when retrieved from the database.
 *
 * -----
 *
 * Works properly, even when `TableT` is a union.
 *
 * Will return a union of rows.
 * Meant for output/read/covariant positions.
 */
export type PartialRow_Output<TableT extends Pick<ITable, "columns">> = (
    TableT extends Pick<ITable, "columns"> ?
    PartialRow_NonUnion<TableT> :
    never
);

/**
 * Represents a partial row of the table, when retrieved from the database.
 *
 * -----
 *
 * Works properly, even when `TableT` is a union.
 *
 * Will return an intersection of rows.
 * Meant for input/write/contravariant positions.
 */
export type PartialRow_Input<TableT extends Pick<ITable, "columns">> = (
    /**
     * When all properties are optional,
     * the input and output types are the same.
     */
    PartialRow_Output<TableT>
);

/**
 * Represents a partial row of the table, when retrieved from the database.
 *
 * An alias of `PartialRow_NonUnion<>` for convenience reasons.
 *
 * -----
 *
 * Assumes `TableT` is not a union.
 *
 * If it is a union, use `PartialRow_Output/Input<U>` instead.
 */
export type PartialRow<TableT extends Pick<ITable, "columns">> = (
    PartialRow_NonUnion<TableT>
);
