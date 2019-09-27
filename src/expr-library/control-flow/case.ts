import {RawExprUtil, RawExpr} from "../../raw-expr";
import {UninitializedCaseValueBuilder, caseValue} from "./case-value";
import {NonNullComparableExpr, ComparableExprUtil} from "../../comparable-expr";
import {UninitializedCaseConditionBuilder, caseCondition} from "./case-condition";

function caseConstructor<
    ValueExprT extends RawExpr<NonNullComparableExpr>
> (
    valueExpr : ValueExprT
) : (
    UninitializedCaseValueBuilder<
        ComparableExprUtil.NonNullComparableType<RawExprUtil.TypeOf<ValueExprT>>,
        RawExprUtil.UsedRef<ValueExprT>
    >
);
function caseConstructor () : (
    UninitializedCaseConditionBuilder
);
function caseConstructor (valueExpr? : any) : (
    | UninitializedCaseValueBuilder<any, any>
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
