import * as tm from "type-mapping/fluent";
import {OperatorType} from "../../operator-type";
import {PrimitiveExpr} from "../../primitive-expr";
import {Decimal} from "../../decimal";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {Expr, expr} from "../../expr";
import {OperatorNodeUtil} from "../../ast";

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
 */
export function castAsDecimal<
    ArgT extends RawExpr<PrimitiveExpr|Decimal>,
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
        usedRef : RawExprUtil.UsedRef<ArgT>,
    }>
) {
    const decimalDefinition = assertValidDecimalPrecisionAndScale(precision, scale);
    return expr(
        {
            mapper : tm.mysql.decimal().orNull(),
            usedRef : RawExprUtil.usedRef(arg),
        },
        OperatorNodeUtil.operatorNode3(
            OperatorType.CAST_AS_DECIMAL,
            [
                RawExprUtil.buildAst(arg),
                RawExprUtil.buildAst(decimalDefinition.precision),
                RawExprUtil.buildAst(decimalDefinition.scale),
            ],
            undefined
        )
    );
}
