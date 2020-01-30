import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const minImpl = makeAggregateOperator2<OperatorType.AGGREGATE_MIN, boolean, bigint, bigint|null>(
    OperatorType.AGGREGATE_MIN,
    tm.mysql.bigIntSigned().orNull(),
    TypeHint.BIGINT_SIGNED
);

/**
 * @todo Figure out what the difference is between `MIN(DISTINCT x)` and `MIN(x)`
 */
export const minDistinct : AggregateOperator1<bigint, bigint|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<bigint|null, ArgT>
) => {
    return minImpl(true, arg) as ExprUtil.AggregateIntersect<bigint|null, ArgT>;
};

export const minAll : AggregateOperator1<bigint, bigint|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<bigint|null, ArgT>
) => {
    return minImpl(false, arg) as ExprUtil.AggregateIntersect<bigint|null, ArgT>;
};

export const min = minAll;
