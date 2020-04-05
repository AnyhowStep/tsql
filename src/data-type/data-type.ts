import * as tm from "type-mapping";
import {BuiltInExpr_NonCorrelated_NonAggregate} from "../built-in-expr";

/**
 * When just using `TypeT` with a `BuiltInValueExpr`,
 * this `DataType<>` interface may seem useless.
 *
 * However, its real usefulness is more apparent
 * when used with custom data types, **and** helper
 * methods that perform reads and writes as atomic
 * operations.
 */
export interface IDataType<TypeT> extends tm.SafeMapper<TypeT> {
    /**
     * Used to serialize a value of `TypeT` to an object this library can use
     * to build SQL queries with.
     *
     * -----
     *
     * Also used when a helper needs to automatically
     * fetch data from the database,
     * and immediately send that value back to the database
     * without any help from the programmer.
     *
     * Examples:
     * + `Log.track()`
     *
     *   Needs to fetch the previous row, and may use previous values
     *   when inserting a new row.
     *
     * + `TablePerType.insertOne()`
     *
     *   After inserting a row to a parent table,
     *   it fetches the row, and may use those values
     *   when inserting rows to derived tables.
     *
     * @param value - The value to convert to a `BuiltInExpr_NonCorrelated`
     */
    toBuiltInExpr_NonCorrelated (value : TypeT) : BuiltInExpr_NonCorrelated_NonAggregate<TypeT>;

    /**
     * Used to determine if two values of `TypeT` are equal.
     *
     * Null-safe equality means if both arguments are `null`,
     * it returns `true`.
     *
     * If one argument is `null` and the other is not,
     * it returns `false`.
     *
     * -----
     *
     * This is used by `Log.track()`
     * to determine if data for a column has changed.
     *
     * Also used by `TablePerType` to check that all duplicate column aliases have the same value.
     */
    isNullSafeEqual (a : TypeT, b : TypeT) : boolean;
}
