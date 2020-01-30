import {AnyBuiltInExpr} from "../../built-in-expr";
import {IQueryBase} from "../../../query-base";

export type IsAggregate<BuiltInExprT extends AnyBuiltInExpr|IQueryBase> =
    /**
     * Could be `IExpr|IExprSelectItem`
     */
    BuiltInExprT extends { isAggregate : boolean } ?
    BuiltInExprT["isAggregate"] :
    false
;
export function isAggregate<BuiltInExprT extends AnyBuiltInExpr|IQueryBase> (
    builtInExpr : BuiltInExprT
) : (
    IsAggregate<BuiltInExprT>
) {
    if (
        builtInExpr instanceof Object &&
        "isAggregate" in builtInExpr &&
        typeof builtInExpr.isAggregate == "boolean"
    ) {
        return builtInExpr.isAggregate as IsAggregate<BuiltInExprT>;
    }

    /**
     * If this came from the`SELECT` clause,
     * it may be an aggregate expression, or a non-aggregate expression.
     *
     * We need to know if this is an aggregate expression to avoid the following query,
     * ```sql
     *  SELECT
     *      COUNT(*) AS x
     *  FROM
     *      T
     *  GROUP BY
     *      id
     *  ORDER BY
     *      -- Error, Cannot nest aggregate expressions
     *      SUM(x) ASC;
     * ```
     *
     * @todo Fix the `OrderByDelegate` to not use `ColumnRef`
     */
    return false as IsAggregate<BuiltInExprT>;
}
