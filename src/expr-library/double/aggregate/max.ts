import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const maxImpl = makeAggregateOperator2<OperatorType.AGGREGATE_MAX, boolean, number, number|null>(
    OperatorType.AGGREGATE_MAX,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);

/**
 * @todo Figure out what the difference is between `MAX(DISTINCT x)` and `MAX(x)`
 */
export const maxDistinct : AggregateOperator1<number, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return maxImpl(true, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

export const maxAll : AggregateOperator1<number, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return maxImpl(false, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

export const max = maxAll;
