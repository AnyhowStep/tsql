import * as tm from "type-mapping/fluent";
import {OperatorType} from "../../operator-type";
import {Decimal} from "../../decimal";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {Expr, expr} from "../../expr";
import {OperatorNodeUtil} from "../../ast";
import {CustomDecimalCastableTypeMap} from "../../augmentable";

/**
 * @todo Move this elsewhere?
 */
export function assertValidDecimalPrecisionAndScale (
    /**
     * + PostgreSQL's min precision is `1`
     * + MySQL's max precision is `65`
     */
    precision : number|bigint,
    /**
     * + The min scale is `0`.
     * + MySQL's max scale is `30`.
     * + `scale` must be <= `precision`.
     */
    scale : number|bigint
) : (
    {
        precision : bigint,
        scale : bigint,
    }
) {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    const precisionMapper = tm.toBigInt().pipe(
        tm.bigIntGtEq(BigInt(1)),
        tm.bigIntLtEq(BigInt(65))
    );
    precision = precisionMapper("precision", precision);
    const scaleMapper = tm.toBigInt().pipe(
        tm.bigIntGtEq(BigInt(0)),
        tm.bigIntLtEq(BigInt(30)),
        tm.bigIntLtEq(precision)
    );
    scale = scaleMapper("scale", scale);
    return {
        precision,
        scale,
    };
}

export type CustomDecimalCastableType = CustomDecimalCastableTypeMap[keyof CustomDecimalCastableTypeMap];

/**
 * These types can be casted to `DECIMAL`, in general.
 *
 * -----
 *
 * ### PostgreSQL
 *
 * + bigint     = OK, or Error (if overflow)
 * + number     = OK, or Error (if overflow)
 * + string     = OK, or Error (if invalid format)
 * + boolean    = Error
 * + Date       = Error
 * + Uint8Array = Error
 * + null       = NULL
 *
 * @todo Convert other cast functions to this
 * @todo Afterwards, determine if all these casting functions should be moved to adapter libraries
 * https://github.com/AnyhowStep/tsql/issues/15
 */
export type DecimalCastableType =
    | bigint
    | number
    | string
    | null
    | CustomDecimalCastableType
;
export type NonNullDecimalCastableType = Exclude<DecimalCastableType, null>;

/**
 * @todo Determine which conversions are not allowed for all `CAST()` functions.
 * For example, casting `bytea` to `DECIMAL` is not allowed in PostgreSQL.
 * It will result in a run-time error.
 *
 * @todo Determine how behaviours differ between DBMS'es
 *
 * For example,
 * + MySQL      : `CAST('a1' AS DECIMAL)` gives `0`
 * + PostgreSQL : `CAST('a1' AS DECIMAL)` throws an error
 * + SQLite     : `CAST('a1' AS DECIMAL)` gives `0`
 *
 * For example,
 * + MySQL      : `CAST('1a1' AS DECIMAL)` gives `1`
 * + PostgreSQL : `CAST('1a1' AS DECIMAL)` throws an error
 * + SQLite     : `CAST('1a1' AS DECIMAL)` gives `1`
 *
 * For example,
 * + MySQL      : `CAST('1e1' AS DECIMAL)` gives `10`
 * + PostgreSQL : `CAST('1e1' AS DECIMAL)` gives `10`
 * + SQLite     : `CAST('1e1' AS DECIMAL)` gives `10`
 *
 * For example,
 * + MySQL      : `CAST(100 AS DECIMAL(2,0))` gives `99`
 * + PostgreSQL : `CAST(100 AS DECIMAL(2,0))` throws an error
 * + SQLite     : `CAST(100 AS DECIMAL(2,0))` gives `100`
 *   + SQLite does not have a `DECIMAL` type.
 *   + So, it's basically just treated like a `NUMERIC` type (and we get an `INTEGER`)
 *
 * @todo Try to unify casting behaviour?
 *
 * -----
 *
 * @todo Is there ever a case where casting a non-null value to `DECIMAL`
 * gives us `NULL`?
 *
 * MySQL seems to return zero, even for data types like `BINARY`.
 *
 * -----
 *
 * ### PostgreSQL
 *
 * + bigint     = OK, or Error (if overflow)
 * + number     = OK, or Error (if overflow)
 * + string     = OK, or Error (if invalid format)
 * + boolean    = Error
 * + Date       = Error
 * + Uint8Array = Error
 * + null       = NULL
 */
export function castAsDecimal<
    ArgT extends BuiltInExpr<NonNullDecimalCastableType|Decimal>,
> (
    arg : ArgT,
    /**
     * + MySQL's max precision is `65`
     * + PostgreSQL's min precision is `1`
     */
    precision : number|bigint,
    /**
     * + MySQL's max scale is `30`.
     * + The min scale is `0`.
     * + `scale` must be <= `precision`.
     */
    scale : number|bigint
) : (
    Expr<{
        mapper : tm.SafeMapper<Decimal>,
        /**
         * @todo Use `TryReuseExistingType<>` hack to fight off depth limit
         */
        usedRef : BuiltInExprUtil.UsedRef<ArgT>,
        isAggregate : BuiltInExprUtil.IsAggregate<ArgT>,
    }>
);
export function castAsDecimal<
    ArgT extends BuiltInExpr<DecimalCastableType|Decimal>,
> (
    arg : ArgT,
    /**
     * + MySQL's max precision is `65`
     * + PostgreSQL's min precision is `1`
     */
    precision : number|bigint,
    /**
     * + MySQL's max scale is `30`.
     * + The min scale is `0`.
     * + `scale` must be <= `precision`.
     */
    scale : number|bigint
) : (
    Expr<{
        mapper : tm.SafeMapper<Decimal|null>,
        /**
         * @todo Use `TryReuseExistingType<>` hack to fight off depth limit
         */
        usedRef : BuiltInExprUtil.UsedRef<ArgT>,
        isAggregate : BuiltInExprUtil.IsAggregate<ArgT>,
    }>
);
export function castAsDecimal<
    ArgT extends BuiltInExpr<DecimalCastableType|Decimal>,
> (
    arg : ArgT,
    /**
     * + MySQL's max precision is `65`
     * + PostgreSQL's min precision is `1`
     */
    precision : number|bigint,
    /**
     * + MySQL's max scale is `30`.
     * + The min scale is `0`.
     * + `scale` must be <= `precision`.
     */
    scale : number|bigint
) : (
    Expr<{
        mapper : tm.SafeMapper<Decimal|null>,
        /**
         * @todo Use `TryReuseExistingType<>` hack to fight off depth limit
         */
        usedRef : BuiltInExprUtil.UsedRef<ArgT>,
        isAggregate : BuiltInExprUtil.IsAggregate<ArgT>,
    }>
) {
    const argMapper = BuiltInExprUtil.mapper(arg);
    const decimalDefinition = assertValidDecimalPrecisionAndScale(precision, scale);
    return expr(
        {
            mapper : tm.canOutputNull(argMapper) ?
                tm.mysql.decimal(precision, scale).orNull() :
                tm.mysql.decimal(precision, scale),
            usedRef : BuiltInExprUtil.usedRef(arg),
            isAggregate : BuiltInExprUtil.isAggregate(arg),
        },
        OperatorNodeUtil.operatorNode3(
            OperatorType.CAST_AS_DECIMAL,
            [
                BuiltInExprUtil.buildAst(arg),
                BuiltInExprUtil.buildAst(decimalDefinition.precision),
                BuiltInExprUtil.buildAst(decimalDefinition.scale),
            ],
            undefined
        )
    );
}
