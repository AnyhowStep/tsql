import * as tm from "type-mapping";
import {Decimal} from "../../decimal";
import {IUsedRef, UsedRefUtil} from "../../used-ref";
import {Expr} from "../../expr";
import {LiteralValueNodeUtil} from "../../ast/literal-value-node";
import {expr} from "../../expr/expr-impl";

/**
 * Converts `string|number|bigint|Decimal` to a `SIGNED BIGINT`
 */
export function signedBigIntLiteral (
    rawSignedBigIntLiteral : string|number|bigint|Decimal
) : (
    Expr<{
        mapper : tm.SafeMapper<bigint>,
        usedRef : IUsedRef<{}>,
        isAggregate : false,
    }>
) {
    const mapper = tm.mysql.bigIntSigned();
    const value = mapper("rawSignedBigIntLiteral", String(rawSignedBigIntLiteral));
    return expr(
        {
            mapper,
            usedRef : UsedRefUtil.fromColumnRef({}),
            isAggregate : false,
        },
        LiteralValueNodeUtil.signedBigIntLiteralNode(
            value
        )
    );
}
