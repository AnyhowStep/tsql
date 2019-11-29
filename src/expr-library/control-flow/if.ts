import * as tm from "type-mapping";
import {BuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {EquatableType, EquatableTypeUtil} from "../../equatable-type";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {ExprUtil} from "../../expr";

function ifConstructor<
    ConditionT extends BuiltInExpr<boolean>,
    ThenT extends BuiltInExpr<EquatableType>,
    ElseT extends BuiltInExpr<EquatableTypeUtil.BaseEquatableType<BuiltInExprUtil.TypeOf<ThenT>>|null>
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
