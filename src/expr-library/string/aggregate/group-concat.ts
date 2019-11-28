import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator3, Operator2} from "../../factory";
import {RawExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";

const groupConcatImpl = makeOperator3<OperatorType.AGGREGATE_GROUP_CONCAT, boolean, string, string, string|null>(
    OperatorType.AGGREGATE_GROUP_CONCAT,
    tm.orNull(tm.string()),
    TypeHint.STRING
);

export const groupConcatDistinct : Operator2<string, string, string|null> = <
    BuiltInExprT extends RawExpr<string>,
    PatternT extends RawExpr<string>,
>(
    rawExpr : BuiltInExprT,
    pattern : PatternT
) : (
    ExprUtil.Intersect<string|null, BuiltInExprT|PatternT>
) => {
    const result = groupConcatImpl<true, BuiltInExprT, PatternT>(true, rawExpr, pattern);
    return result as ExprUtil.Intersect<string|null, BuiltInExprT|PatternT>;
};

export const groupConcatAll : Operator2<string, string, string|null> = <
    BuiltInExprT extends RawExpr<string>,
    PatternT extends RawExpr<string>,
>(
    rawExpr : BuiltInExprT,
    pattern : PatternT
) : (
    ExprUtil.Intersect<string|null, BuiltInExprT|PatternT>
) => {
    const result = groupConcatImpl<false, BuiltInExprT, PatternT>(false, rawExpr, pattern);
    return result as ExprUtil.Intersect<string|null, BuiltInExprT|PatternT>;
};
