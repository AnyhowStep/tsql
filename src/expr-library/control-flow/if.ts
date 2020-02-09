import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil, AnyBuiltInExpr} from "../../built-in-expr";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {ExprUtil} from "../../expr";
import {BaseType} from "../../type-util";

/**
 * Behaves like an `if-else` statement from most programming languages.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html#function_if
 *
 * -----
 *
 * + MySQL        : `IF(x, y, z)`
 * + PostgreSQL   : `CASE WHEN x THEN y ELSE z END`
 * + SQLite       : `CASE WHEN x THEN y ELSE z END`
 *
 * -----
 *
 * @param condition - The boolean expression to evaluate
 * @param then - The result if `condition` is `true`
 * @param elseResult - The result if `condition` is `false`
 *
 * @see caseCondition
 */
function ifConstructor<
    ConditionT extends BuiltInExpr<boolean>,
    ThenT extends AnyBuiltInExpr,
    ElseT extends BuiltInExpr<BaseType<BuiltInExprUtil.TypeOf<ThenT>>|null>
> (
    condition : ConditionT,
    then : ThenT,
    elseResult : ElseT
) : (
    ExprUtil.Intersect<
        BuiltInExprUtil.TypeOf<ThenT|ElseT>,
        ConditionT|ThenT|ElseT
    >
) {
    return ExprUtil.intersect<
        BuiltInExprUtil.TypeOf<ThenT|ElseT>,
        ConditionT|ThenT|ElseT
    >(
        tm.or(
            BuiltInExprUtil.mapper(then),
            BuiltInExprUtil.mapper(elseResult)
        ),
        [condition, then, elseResult],
        OperatorNodeUtil.operatorNode3(
            OperatorType.IF,
            [
                BuiltInExprUtil.buildAst(condition),
                BuiltInExprUtil.buildAst(then),
                BuiltInExprUtil.buildAst(elseResult),
            ],
            undefined
        )
    );
}
export {
    ifConstructor as if,
};
