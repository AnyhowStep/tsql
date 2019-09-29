import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {RawExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";

const maxImpl = makeOperator2<OperatorType.AGGREGATE_MAX, boolean, bigint, bigint|null>(
    OperatorType.AGGREGATE_MAX,
    tm.mysql.bigIntSigned().orNull(),
    TypeHint.BIGINT_SIGNED
);

/**
 * @todo Figure out what the difference is between `MAX(DISTINCT x)` and `MAX(x)`
 */
export const maxDistinct : Operator1<bigint, bigint|null> = <
    ArgT extends RawExpr<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<bigint|null, ArgT>
) => {
    return maxImpl(true, arg);
};

export const maxAll : Operator1<bigint, bigint|null> = <
    ArgT extends RawExpr<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<bigint|null, ArgT>
) => {
    return maxImpl(false, arg);
};

export const max = maxAll;
