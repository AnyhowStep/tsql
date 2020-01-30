import * as tm from "type-mapping";
import {QueryBaseUtil} from "../../query-base";
import {Expr, expr} from "../../expr";
import {operatorNode1} from "../../ast/operator-node/util";
import {OperatorType} from "../../operator-type";
import {UsedRefUtil} from "../../used-ref";

export function exists<
    QueryT extends QueryBaseUtil.AfterFromClause|QueryBaseUtil.AfterSelectClause
> (
    query : QueryT
) : (
    Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : UsedRefUtil.FromFromClause<QueryT["fromClause"]>,
        /**
         * Sub-queries are not aggregate expressions.
         * `EXISTS()` isn't an aggregate function, either.
         */
        isAggregate : false,
    }>
) {
    if (!QueryBaseUtil.isAfterFromClause(query) && !QueryBaseUtil.isAfterSelectClause(query)) {
        throw new Error(`Query must be after FROM/SELECT clause`);
    }
    return expr(
        {
            mapper : tm.mysql.boolean(),
            usedRef : UsedRefUtil.fromFromClause(query.fromClause),
            isAggregate : false,
        },
        operatorNode1(OperatorType.EXISTS, [query], undefined)
    );
}
