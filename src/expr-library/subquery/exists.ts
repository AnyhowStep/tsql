import * as tm from "type-mapping";
import {QueryBaseUtil} from "../../query-base";
import {Expr, expr} from "../../expr";
import {operatorNode1} from "../../ast/operator-node/util";
import {OperatorType} from "../../operator-type";
import {UsedRefUtil} from "../../used-ref";
import {BuiltInExprUtil} from "../../built-in-expr";

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
    /**
     * Hack for MySQL 5.7 and SQLite < 3.30 thinking the following is `true`,
     * ```sql
     *  EXISTS(SELECT 'hello' LIMIT 0);
     * ```
     */
    if (query.compoundQueryClause == undefined) {
        if (
            (
                query.compoundQueryLimitClause != undefined &&
                Number(query.compoundQueryLimitClause.maxRowCount) == 0
            ) ||
            (
                query.limitClause != undefined &&
                Number(query.limitClause.maxRowCount) == 0
            )
        ) {
            return expr(
                {
                    mapper : tm.mysql.boolean(),
                    usedRef : UsedRefUtil.fromFromClause(query.fromClause),
                    isAggregate : false,
                },
                BuiltInExprUtil.buildAst(false)
            );
        }
    } else {
        if (
            query.compoundQueryLimitClause != undefined &&
            Number(query.compoundQueryLimitClause.maxRowCount) == 0
        ) {
            return expr(
                {
                    mapper : tm.mysql.boolean(),
                    usedRef : UsedRefUtil.fromFromClause(query.fromClause),
                    isAggregate : false,
                },
                BuiltInExprUtil.buildAst(false)
            );
        }
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
