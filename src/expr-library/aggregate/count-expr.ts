import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeOperator2} from "../factory";
import {AnyRawExpr} from "../../raw-expr";
import {ExprUtil} from "../../expr";

const countExprImpl = makeOperator2<OperatorType.AGGREGATE_COUNT_EXPR, boolean, any, bigint>(
    OperatorType.AGGREGATE_COUNT_EXPR,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned()
);

export const countExprDistinct = <
    ArgT extends AnyRawExpr
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<bigint, ArgT>
) => {
    return countExprImpl(true, arg);
};

export const countExprAll = <
    ArgT extends AnyRawExpr
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<bigint, ArgT>
) => {
    return countExprImpl(false, arg);
};
