import {decimalMapper} from "../decimal-mapper";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {Decimal} from "../../../decimal";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const avgImpl = makeAggregateOperator2<OperatorType.AGGREGATE_AVERAGE, boolean, Decimal, Decimal|null>(
    OperatorType.AGGREGATE_AVERAGE,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);

export const avgDistinct : AggregateOperator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return avgImpl(true, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

export const avgAll : AggregateOperator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return avgImpl(false, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

export const avg = avgAll;
