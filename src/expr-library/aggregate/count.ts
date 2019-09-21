import * as tm from "type-mapping";
import {Expr} from "../../expr";
import {IUsedRef, UsedRefUtil} from "../../used-ref";
import {ExprImpl} from "../../expr/expr-impl";
import {operatorNode0} from "../../ast/operator-node/util";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_count
 *
 * @todo Implement support for `OVER()` clause
 */
export function count () : (
    Expr<{
        mapper : tm.SafeMapper<bigint>,
        usedRef : IUsedRef<{}>,
    }>
) {
    const result = new ExprImpl(
        {
            mapper : tm.mysql.bigIntUnsigned(),
            usedRef : UsedRefUtil.fromColumnRef({}),
        },
        operatorNode0(OperatorType.AGGREGATE_COUNT_ALL, undefined)
    );
    return result;
}
