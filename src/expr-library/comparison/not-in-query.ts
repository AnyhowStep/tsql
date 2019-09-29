/**
 * @todo Refactor `inQuery()` and `notInQuery()` so they can share code.
 * Something like a `makeInQuery()` factory function.
 */
import * as tm from "type-mapping";
import {QueryBaseUtil} from "../../query-base";
import {Expr, expr} from "../../expr";
import {OperatorType} from "../../operator-type";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {NonNullEquatableType, EquatableTypeUtil} from "../../equatable-type";
import {OperatorNodeUtil} from "../../ast";

/**
 * The `NOT IN` operator has two overloads.
 * + `x NOT IN (y0, y1, y2, y3, ...)`
 * + `x NOT IN (SELECT y FROM ...)`
 *
 * This implementation is for the second overload.
 *
 * -----
 *
 * The first argument cannot be `null` because `NULL NOT IN (...)` is always `NULL`.
 *
 * The query argument cannot `SELECT` `null` because,
 * + `x NOT IN (SELECT NULL)` is `NULL`
 * + `x NOT IN (SELECT nullableColumn FROM myTable)` is `NULL` if,
 *   + At least one row has a `NULL` value
 *   + No rows have the value `x`
 * + `x NOT IN (SELECT nonNullColumn FROM myTable UNION SELECT NULL)` is `NULL` if,
 *   + No rows have the value `x`
 * + `1 NOT IN (SELECT NULL UNION SELECT 1)` is `false`
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
 * SELECT 1 NOT IN (SELECT id FROM myTable LIMIT 1);
 * ```
 *
 * The following is a workaround,
 * ```sql
 * CREATE TABLE myTable (id INT);
 * INSERT INTO myTable VALUES (1);
 * SELECT 1 NOT IN (SELECT * FROM (SELECT id FROM myTable LIMIT 1) AS tmp);
 * ```
 */
export function notInQuery<
    RawExprT extends RawExpr<NonNullEquatableType>,
    QueryT extends QueryBaseUtil.OneSelectItem<EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<RawExprT>>>
> (
    rawExpr : RawExprT,
    query : QueryT
) : (
    Expr<{
        mapper : tm.SafeMapper<boolean>,
        usedRef : RawExprUtil.IntersectUsedRef<RawExprT|QueryT>,
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
            usedRef : RawExprUtil.intersectUsedRef(rawExpr, query),
        },
        OperatorNodeUtil.operatorNode2(OperatorType.NOT_IN, [
            RawExprUtil.buildAst(rawExpr),
            RawExprUtil.buildAst(query)
        ], undefined)
    );
}
