import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {BuiltInExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";

const minImpl = makeOperator2<OperatorType.AGGREGATE_MIN, boolean, number, number|null>(
    OperatorType.AGGREGATE_MIN,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);

/**
 * @todo Figure out what the difference is between `MIN(DISTINCT x)` and `MIN(x)`
 */
export const minDistinct : Operator1<number, number|null> = <
    ArgT extends BuiltInExpr<number>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<number|null, ArgT>
) => {
    return minImpl(true, arg);
};

export const minAll : Operator1<number, number|null> = <
    ArgT extends BuiltInExpr<number>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<number|null, ArgT>
) => {
    return minImpl(false, arg);
};

export const min = minAll;
