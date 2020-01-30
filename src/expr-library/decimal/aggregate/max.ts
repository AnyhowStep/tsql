import {decimalMapper} from "../decimal-mapper";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {Decimal} from "../../../decimal";

const maxImpl = makeAggregateOperator2<OperatorType.AGGREGATE_MAX, boolean, Decimal, Decimal|null>(
    OperatorType.AGGREGATE_MAX,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);

/**
 * @todo Figure out what the difference is between `MAX(DISTINCT x)` and `MAX(x)`
 */
export const maxDistinct : AggregateOperator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return maxImpl(true, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

export const maxAll : AggregateOperator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return maxImpl(false, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

export const max = maxAll;
