import {BuiltInExprUtil, BuiltInExpr} from "../../built-in-expr";
import {UninitializedCaseValueBuilder, caseValue} from "./case-value";
import {UninitializedCaseConditionBuilder, caseCondition} from "./case-condition";
import {BaseType} from "../../type-util";

/**
 * Behaves like a `switch` statement from most programming languages.
 *
 * + https://dev.mysql.com/doc/refman/5.7/en/control-flow-functions.html#operator_case
 * + https://www.postgresql.org/docs/8.4/functions-conditional.html#AEN15225
 * + https://www.sqlite.org/lang_expr.html#case
 *
 * -----
 *
 * This version of the `CASE` expression does not allow `null` values.
 * This reduces the probability of a mistake. Consider,
 * ```sql
 *  SELECT
 *      CASE NULL
 *          WHEN NULL THEN 1
 *          ELSE 2
 *      END
 *  ;
 *  > 2 -- The result is `2` and not `1`
 * ```
 *
 * -----
 *
 * @param valueExpr - The expression to compare against; must not be nullable
 *
 * @see caseValue
 */
function caseConstructor<
    ValueExprT extends BuiltInExpr<unknown>
> (
    valueExpr : ValueExprT & BuiltInExprUtil.AssertNonNull<ValueExprT>
) : (
    UninitializedCaseValueBuilder<
        BaseType<BuiltInExprUtil.TypeOf<ValueExprT>>,
        BuiltInExprUtil.UsedRef<ValueExprT>,
        BuiltInExprUtil.IsAggregate<ValueExprT>
    >
);

/**
 * Behaves like an `if` statement from most programming languages.
 *
 * + https://dev.mysql.com/doc/refman/5.7/en/control-flow-functions.html#operator_case
 * + https://www.postgresql.org/docs/8.4/functions-conditional.html#AEN15225
 * + https://www.sqlite.org/lang_expr.html#case
 *
 * @see caseCondition
 */
function caseConstructor () : (
    UninitializedCaseConditionBuilder
);
function caseConstructor (valueExpr? : any) : (
    | UninitializedCaseValueBuilder<any, any, any>
    | UninitializedCaseConditionBuilder
) {
    if (valueExpr === undefined) {
        return caseCondition();
    } else {
        return caseValue(valueExpr);
    }
}
export {
    caseConstructor as case,
};
