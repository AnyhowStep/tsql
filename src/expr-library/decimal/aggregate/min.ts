import {decimalMapper} from "../decimal-mapper";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {Decimal} from "../../../decimal";

const minImpl = makeAggregateOperator2<OperatorType.AGGREGATE_MIN, boolean, Decimal, Decimal|null>(
    OperatorType.AGGREGATE_MIN,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);

/**
 * @todo Figure out what the difference is between `MIN(DISTINCT x)` and `MIN(x)`
 */
export const minDistinct : AggregateOperator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return minImpl(true, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

export const minAll : AggregateOperator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return minImpl(false, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

export const min = minAll;
