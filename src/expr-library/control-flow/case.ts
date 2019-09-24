import {RawExprUtil, RawExpr} from "../../raw-expr";
import {UninitializedCaseBuilder, caseValue} from "./case-value";
import {NonNullComparableExpr, ComparableExprUtil} from "../../comparable-expr";

function caseConstructor<
    ValueExprT extends RawExpr<NonNullComparableExpr>
> (
    valueExpr : ValueExprT
) : (
    UninitializedCaseBuilder<
        ComparableExprUtil.NonNullComparableType<RawExprUtil.TypeOf<ValueExprT>>,
        RawExprUtil.UsedRef<ValueExprT>
    >
) {
    return caseValue(valueExpr);
}
export {
    caseConstructor as case,
};
