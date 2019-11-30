import {decimalMapper} from "../decimal-mapper";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {BuiltInExpr} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {Decimal} from "../../../decimal";

const minImpl = makeOperator2<OperatorType.AGGREGATE_MIN, boolean, Decimal, Decimal|null>(
    OperatorType.AGGREGATE_MIN,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);

/**
 * @todo Figure out what the difference is between `MIN(DISTINCT x)` and `MIN(x)`
 */
export const minDistinct : Operator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return minImpl(true, arg);
};

export const minAll : Operator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return minImpl(false, arg);
};

export const min = minAll;
