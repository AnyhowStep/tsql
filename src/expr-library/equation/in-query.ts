import * as tm from "type-mapping";
import {QueryBaseUtil} from "../../query-base";
import {Expr, expr} from "../../expr";
import {OperatorType} from "../../operator-type";
import {BuiltInExprUtil, AnyBuiltInExpr} from "../../built-in-expr";
import {OperatorNodeUtil} from "../../ast";
import {BaseType} from "../../type-util";

/**
 * The `IN` operator has two overloads.
 * + `x IN (y0, y1, y2, y3, ...)`
 * + `x IN (SELECT y FROM ...)`
 *
 * This implementation is for the second overload.
 *
 * -----
 *
 * The first argument cannot be `null` because `NULL IN (...)` is always `NULL`.
 *
 * The query argument cannot `SELECT` `null` because,
 * + `x IN (SELECT NULL)` is `NULL`
 * + `x IN (SELECT nullableColumn FROM myTable)` is `NULL` if,
 *   + At least one row has a `NULL` value
 *   + No rows have the value `x`
 * + `x IN (SELECT nonNullColumn FROM myTable UNION SELECT NULL)` is `NULL` if,
 *   + No rows have the value `x`
 * + `1 IN (SELECT NULL UNION SELECT 1)` is `true`
 *
 * -----
 *
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_in
 *
 * > To comply with the SQL standard,
 * > `IN()` returns `NULL` not only if the expression on the left hand side is `NULL`,
 * > but also if no match is found in the list and one of the expressions in the list is `NULL`.
 *
 * https://dev.mysql.com/doc/refman/8.0/en/any-in-some-subqueries.html
 *
 * -----
 *
 * ### Problems with MySQL
 *
 * The following produced an error,
 * ```sql
 * CREATE TABLE myTable (id INT);
 * INSERT INTO myTable VALUES (1);
 * SELECT 1 IN (SELECT id FROM myTable LIMIT 1);
 * ```
 *
 * The following is a workaround,
 * ```sql
 * CREATE TABLE myTable (id INT);
 * INSERT INTO myTable VALUES (1);
 * SELECT 1 IN (SELECT * FROM (SELECT id FROM myTable LIMIT 1) AS tmp);
 * ```
 */
export function inQuery<
    BuiltInExprT extends AnyBuiltInExpr,
    QueryT extends QueryBaseUtil.OneSelectItem<BaseType<BuiltInExprUtil.TypeOf<BuiltInExprT>>>
> (
    builtInExpr : BuiltInExprT & BuiltInExprUtil.AssertNonNull<BuiltInExprT>,
    query : QueryT
) : (
    Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : BuiltInExprUtil.IntersectUsedRef<BuiltInExprT|QueryT>,
        isAggregate : BuiltInExprUtil.IsAggregate<BuiltInExprT>,
    }>
) {
    if (!QueryBaseUtil.isOneSelectItem(query)) {
        throw new Error(`Query must SELECT one item`);
    }
    if (tm.canOutputNull(query.selectClause[0].mapper)) {
        throw new Error(`Query must not SELECT nullable value`);
    }

    return expr(
        {
            mapper : tm.mysql.boolean(),
            usedRef : BuiltInExprUtil.intersectUsedRef(builtInExpr as BuiltInExprT, query),
            isAggregate : BuiltInExprUtil.isAggregate(builtInExpr),
        },
        OperatorNodeUtil.operatorNode2(OperatorType.IN_QUERY, [
            BuiltInExprUtil.buildAst(builtInExpr),
            BuiltInExprUtil.buildAst(query)
        ], undefined)
    );
}
