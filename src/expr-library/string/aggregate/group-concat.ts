import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator3, AggregateOperator2} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const groupConcatImpl = makeAggregateOperator3<OperatorType.AGGREGATE_GROUP_CONCAT, boolean, string, string, string|null>(
    OperatorType.AGGREGATE_GROUP_CONCAT,
    tm.orNull(tm.string()),
    TypeHint.STRING
);

export const groupConcatDistinct : AggregateOperator2<string, string, string|null> = <
    BuiltInExprT extends BuiltInExpr_NonAggregate<string>,
    PatternT extends BuiltInExpr_NonAggregate<string>,
>(
    builtInExpr : BuiltInExprT,
    pattern : PatternT
) : (
    ExprUtil.AggregateIntersect<string|null, BuiltInExprT|PatternT>
) => {
    const result = groupConcatImpl<true, BuiltInExprT, PatternT>(true, builtInExpr, pattern);
    return result as ExprUtil.AggregateIntersect<string|null, BuiltInExprT|PatternT>;
};

export const groupConcatAll : AggregateOperator2<string, string, string|null> = <
    BuiltInExprT extends BuiltInExpr_NonAggregate<string>,
    PatternT extends BuiltInExpr_NonAggregate<string>,
>(
    builtInExpr : BuiltInExprT,
    pattern : PatternT
) : (
    ExprUtil.AggregateIntersect<string|null, BuiltInExprT|PatternT>
) => {
    const result = groupConcatImpl<false, BuiltInExprT, PatternT>(false, builtInExpr, pattern);
    return result as ExprUtil.AggregateIntersect<string|null, BuiltInExprT|PatternT>;
};
