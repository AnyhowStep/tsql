import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {RawExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";

const maxImpl = makeOperator2<OperatorType.AGGREGATE_MAX, boolean, number, number|null>(
    OperatorType.AGGREGATE_MAX,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);

/**
 * @todo Figure out what the difference is between `MAX(DISTINCT x)` and `MAX(x)`
 */
export const maxDistinct : Operator1<number, number|null> = <
    ArgT extends RawExpr<number>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<number|null, ArgT>
) => {
    return maxImpl(true, arg);
};

export const maxAll : Operator1<number, number|null> = <
    ArgT extends RawExpr<number>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<number|null, ArgT>
) => {
    return maxImpl(false, arg);
};

export const max = maxAll;
