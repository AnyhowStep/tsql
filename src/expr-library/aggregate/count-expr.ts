import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeOperator2, Operator1} from "../factory";
import {RawExpr} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {EquatableType} from "../../equatable-type";

const countExprImpl = makeOperator2<OperatorType.AGGREGATE_COUNT_EXPR, boolean, EquatableType, bigint>(
    OperatorType.AGGREGATE_COUNT_EXPR,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned()
);

export const countExprDistinct : Operator1<EquatableType, bigint> = <
    ArgT extends RawExpr<EquatableType>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<bigint, ArgT>
) => {
    return countExprImpl(true, arg);
};

export const countExprAll : Operator1<EquatableType, bigint> = <
    ArgT extends RawExpr<EquatableType>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<bigint, ArgT>
) => {
    return countExprImpl(false, arg);
};
