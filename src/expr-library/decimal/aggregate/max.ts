import {decimalMapper} from "../decimal-mapper";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {RawExpr} from "../../../raw-expr";
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
    ArgT extends RawExpr<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return maxImpl(true, arg);
};

export const maxAll : Operator1<Decimal, Decimal|null> = <
    ArgT extends RawExpr<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return maxImpl(false, arg);
};

export const max = maxAll;
