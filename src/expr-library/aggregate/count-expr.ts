import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeAggregateOperator2, AggregateOperator1} from "../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../built-in-expr";
import {ExprUtil} from "../../expr";
import {EquatableType} from "../../equatable-type";

const countExprImpl = makeAggregateOperator2<OperatorType.AGGREGATE_COUNT_EXPR, boolean, EquatableType, bigint>(
    OperatorType.AGGREGATE_COUNT_EXPR,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned()
);

export const countExprDistinct : AggregateOperator1<EquatableType, bigint> = <
    ArgT extends BuiltInExpr_NonAggregate<EquatableType>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<bigint, ArgT>
) => {
    return countExprImpl(true, arg) as  ExprUtil.AggregateIntersect<bigint, ArgT>;
};

export const countExprAll : AggregateOperator1<EquatableType, bigint> = <
    ArgT extends BuiltInExpr_NonAggregate<EquatableType>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<bigint, ArgT>
) => {
    return countExprImpl(false, arg) as  ExprUtil.AggregateIntersect<bigint, ArgT>;
};

export const countExpr = countExprAll;
