import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const minImpl = makeAggregateOperator2<OperatorType.AGGREGATE_MIN, boolean, number, number|null>(
    OperatorType.AGGREGATE_MIN,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);

/**
 * @todo Figure out what the difference is between `MIN(DISTINCT x)` and `MIN(x)`
 */
export const minDistinct : AggregateOperator1<number, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return minImpl(true, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

export const minAll : AggregateOperator1<number, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return minImpl(false, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

export const min = minAll;
