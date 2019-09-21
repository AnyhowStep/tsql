import * as tm from "type-mapping";
import {Decimal} from "../../decimal";
import {IUsedRef, UsedRefUtil} from "../../used-ref";
import {Expr} from "../../expr";
import {LiteralValueNodeUtil} from "../../ast/literal-value-node";
import {expr} from "../../expr/expr-impl";

export function unsignedBigIntLiteral (
    rawUnsignedBigIntLiteral : string|number|bigint|Decimal
) : (
    Expr<{
        mapper : tm.SafeMapper<bigint>,
        usedRef : IUsedRef<{}>,
    }>
) {
    const mapper = tm.mysql.bigIntUnsigned();
    const value = mapper("rawUnsignedBigIntLiteral", String(rawUnsignedBigIntLiteral));
    return expr(
        {
            mapper,
            usedRef : UsedRefUtil.fromColumnRef({}),
        },
        LiteralValueNodeUtil.unsignedBigIntLiteralNode(
            value
        )
    );
}
