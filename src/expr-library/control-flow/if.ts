import * as tm from "type-mapping";
import {RawExpr, RawExprUtil} from "../../raw-expr";
import {EquatableType, EquatableTypeUtil} from "../../equatable-type";
import {OperatorNodeUtil} from "../../ast";
import {OperatorType} from "../../operator-type";
import {ExprUtil} from "../../expr";

function ifConstructor<
    ConditionT extends RawExpr<boolean>,
    ThenT extends RawExpr<EquatableType>,
    ElseT extends RawExpr<EquatableTypeUtil.BaseEquatableType<RawExprUtil.TypeOf<ThenT>>|null>
> (
    condition : ConditionT,
    then : ThenT,
    elseResult : ElseT
) : (
    ExprUtil.Intersect<
        RawExprUtil.TypeOf<ThenT|ElseT>,
        ConditionT|ThenT|ElseT
    >
) {
    return ExprUtil.intersect<
        RawExprUtil.TypeOf<ThenT|ElseT>,
        ConditionT|ThenT|ElseT
    >(
        tm.or(
            RawExprUtil.mapper(then),
            RawExprUtil.mapper(elseResult)
        ),
        [condition, then, elseResult],
        OperatorNodeUtil.operatorNode3(
            OperatorType.IF,
            [
                RawExprUtil.buildAst(condition),
                RawExprUtil.buildAst(then),
                RawExprUtil.buildAst(elseResult),
            ],
            undefined
        )
    );
}
export {
    ifConstructor as if,
};
