import {decimalMapper} from "../decimal-mapper";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {BuiltInExpr} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {Decimal} from "../../../decimal";

const maxImpl = makeOperator2<OperatorType.AGGREGATE_MAX, boolean, Decimal, Decimal|null>(
    OperatorType.AGGREGATE_MAX,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);

/**
 * @todo Figure out what the difference is between `MAX(DISTINCT x)` and `MAX(x)`
 */
export const maxDistinct : Operator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return maxImpl(true, arg) as ExprUtil.Intersect<Decimal|null, ArgT>;
};

export const maxAll : Operator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return maxImpl(false, arg) as ExprUtil.Intersect<Decimal|null, ArgT>;
};

export const max = maxAll;
