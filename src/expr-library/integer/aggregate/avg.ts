import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {Decimal} from "../../../decimal";
import {BuiltInExpr} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {decimalMapper} from "../../decimal/decimal-mapper";

/**
 * The return type being `DECIMAL` is intentional.
 */
const avgImpl = makeOperator2<OperatorType.AGGREGATE_AVERAGE, boolean, bigint, Decimal|null>(
    OperatorType.AGGREGATE_AVERAGE,
    decimalMapper.orNull(),
    TypeHint.BIGINT_SIGNED
);

export const avgDistinct : Operator1<bigint, Decimal|null> = <
    ArgT extends BuiltInExpr<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return avgImpl(true, arg) as ExprUtil.Intersect<Decimal|null, ArgT>;
};

export const avgAll : Operator1<bigint, Decimal|null> = <
    ArgT extends BuiltInExpr<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return avgImpl(false, arg) as ExprUtil.Intersect<Decimal|null, ArgT>;
};

export const avg = avgAll;
