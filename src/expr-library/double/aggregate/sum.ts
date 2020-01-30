import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const sumImpl = makeAggregateOperator2<OperatorType.AGGREGATE_SUM, boolean, number, number|null>(
    OperatorType.AGGREGATE_SUM,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);

export const sumDistinct : AggregateOperator1<number, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return sumImpl(true, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

export const sumAll : AggregateOperator1<number, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return sumImpl(false, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

export const sum = sumAll;
