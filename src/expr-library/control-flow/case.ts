import {RawExprUtil, BuiltInExpr} from "../../raw-expr";
import {UninitializedCaseValueBuilder, caseValue} from "./case-value";
import {NonNullEquatableType, EquatableTypeUtil} from "../../equatable-type";
import {UninitializedCaseConditionBuilder, caseCondition} from "./case-condition";

function caseConstructor<
    ValueExprT extends BuiltInExpr<NonNullEquatableType>
> (
    valueExpr : ValueExprT
) : (
    UninitializedCaseValueBuilder<
        EquatableTypeUtil.BaseNonNullEquatableType<RawExprUtil.TypeOf<ValueExprT>>,
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
