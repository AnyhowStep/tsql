import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const avgImpl = makeAggregateOperator2<OperatorType.AGGREGATE_AVERAGE, boolean, number, number|null>(
    OperatorType.AGGREGATE_AVERAGE,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);

export const avgDistinct : AggregateOperator1<number, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return avgImpl(true, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

export const avgAll : AggregateOperator1<number, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return avgImpl(false, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

export const avg = avgAll;
