import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {Decimal} from "../../../decimal";
import {decimalMapper} from "../../decimal/decimal-mapper";

/**
 * The return type being `DECIMAL` is intentional.
 */
const sumImpl = makeAggregateOperator2<OperatorType.AGGREGATE_SUM, boolean, bigint, Decimal|null>(
    OperatorType.AGGREGATE_SUM,
    decimalMapper.orNull(),
    TypeHint.BIGINT_SIGNED
);

export const sumDistinct : AggregateOperator1<bigint, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return sumImpl(true, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

export const sumAll : AggregateOperator1<bigint, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return sumImpl(false, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
};

export const sum = sumAll;
