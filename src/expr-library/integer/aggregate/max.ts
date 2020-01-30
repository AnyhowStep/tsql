import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const maxImpl = makeAggregateOperator2<OperatorType.AGGREGATE_MAX, boolean, bigint, bigint|null>(
    OperatorType.AGGREGATE_MAX,
    tm.mysql.bigIntSigned().orNull(),
    TypeHint.BIGINT_SIGNED
);

/**
 * @todo Figure out what the difference is between `MAX(DISTINCT x)` and `MAX(x)`
 */
export const maxDistinct : AggregateOperator1<bigint, bigint|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<bigint|null, ArgT>
) => {
    return maxImpl(true, arg) as ExprUtil.AggregateIntersect<bigint|null, ArgT>;
};

export const maxAll : AggregateOperator1<bigint, bigint|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<bigint|null, ArgT>
) => {
    return maxImpl(false, arg) as ExprUtil.AggregateIntersect<bigint|null, ArgT>;
};

export const max = maxAll;
