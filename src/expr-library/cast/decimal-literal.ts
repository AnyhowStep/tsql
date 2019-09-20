import * as tm from "type-mapping";
import {Decimal} from "../../decimal";
import {IUsedRef, UsedRefUtil} from "../../used-ref";
import {Expr} from "../../expr";
import {LiteralValueNodeUtil} from "../../ast/literal-value-node";
import {expr} from "../../expr/expr-impl";

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
        mapper : tm.SafeMapper<Decimal|null>,
        usedRef : IUsedRef<{}>,
    }>
) {
    return expr(
        {
            mapper : tm.mysql.decimal(),
            usedRef : UsedRefUtil.fromColumnRef({}),
        },
        LiteralValueNodeUtil.decimalLiteralNode(
            rawDecimalLiteral,
            precision,
            scale
        )
    );
}
