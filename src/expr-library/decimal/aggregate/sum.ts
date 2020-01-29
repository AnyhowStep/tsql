import {decimalMapper} from "../decimal-mapper";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {Decimal} from "../../../decimal";

const sumImpl = makeAggregateOperator2<OperatorType.AGGREGATE_SUM, boolean, Decimal, Decimal|null>(
    OperatorType.AGGREGATE_SUM,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);

export const sumDistinct : AggregateOperator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return sumImpl(true, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

export const sumAll : AggregateOperator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return sumImpl(false, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

export const sum = sumAll;
