import * as tm from "type-mapping";
import {ITable} from "../table";
import {UnionToIntersection} from "../type-util";

/**
 * Represents a row of the table, when retrieved from the database.
 *
 * -----
 *
 * Assumes `TableT` is not a union.
 *
 * If it is a union, use `Row_Output/Input<U>` instead.
 *
 * -----
 *
 * Also assumes `TableT["columns"]` are not unions.
 * They really shouldn't be unions.
 * + Why does your table not have a definite set of columns?
 *   Is it Schrödinger's columns?
 */
export type Row_NonUnion<TableT extends Pick<ITable, "columns">> = (
    {
        readonly [columnAlias in Extract<keyof TableT["columns"], string>] : (
            tm.OutputOf<TableT["columns"][columnAlias]["mapper"]>
        )
    }
);

/**
 * Represents a row of the table, when retrieved from the database.
 *
 * -----
 *
 * Works properly, even when `TableT` is a union.
 *
 * Will return a union of rows.
 * Meant for output/read/covariant positions.
 */
export type Row_Output<TableT extends Pick<ITable, "columns">> = (
    TableT extends Pick<ITable, "columns"> ?
    Row_NonUnion<TableT> :
    never
);

/**
 * Represents a row of the table, when retrieved from the database.
 *
 * -----
 *
 * Works properly, even when `TableT` is a union.
 *
 * Will return an intersection of rows.
 * Meant for input/write/contravariant positions.
 */
export type Row_Input<TableT extends Pick<ITable, "columns">> = (
    UnionToIntersection<
        Row_Output<TableT>
    >
);

/**
 * Represents a row of the table, when retrieved from the database.
 *
 * An alias of `Row_NonUnion<>` for convenience reasons.
 *
 * -----
 *
 * Assumes `TableT` is not a union.
 *
 * If it is a union, use `Row_Output/Input<U>` instead.
 */
export type Row<TableT extends Pick<ITable, "columns">> = (
    Row_NonUnion<TableT>
);
