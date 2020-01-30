import * as tm from "type-mapping";
import {Decimal} from "../../decimal";
import {IUsedRef, UsedRefUtil} from "../../used-ref";
import {Expr} from "../../expr";
import {LiteralValueNodeUtil} from "../../ast/literal-value-node";
import {expr} from "../../expr/expr-impl";

/**
 *
 * @param rawDecimalLiteral
 *
 * @param precision
 * + MySQL's max precision is `65`
 * + PostgreSQL's min precision is `1`
 *
 * @param scale
 * + MySQL's max scale is `30`.
 * + The min scale is `0`.
 * + `scale` must be <= `precision`.
 */
export function decimalLiteral (
    rawDecimalLiteral : string|number|bigint|Decimal,
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
        usedRef : IUsedRef<{}>,
        isAggregate : false,
    }>
) {
    return expr(
        {
            mapper : tm.mysql.decimal(precision, scale),
            usedRef : UsedRefUtil.fromColumnRef({}),
            isAggregate : false,
        },
        LiteralValueNodeUtil.decimalLiteralNode(
            rawDecimalLiteral,
            precision,
            scale
        )
    );
}
