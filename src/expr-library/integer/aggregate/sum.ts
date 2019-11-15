import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {RawExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";
import {Decimal} from "../../../decimal";
import {decimalMapper} from "../../decimal/decimal-mapper";

/**
 * The return type being `DECIMAL` is intentional.
 */
const sumImpl = makeOperator2<OperatorType.AGGREGATE_SUM, boolean, bigint, Decimal|null>(
    OperatorType.AGGREGATE_SUM,
    decimalMapper.orNull(),
    TypeHint.BIGINT_SIGNED
);

export const sumDistinct : Operator1<bigint, Decimal|null> = <
    ArgT extends RawExpr<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return sumImpl(true, arg);
};

export const sumAll : Operator1<bigint, Decimal|null> = <
    ArgT extends RawExpr<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return sumImpl(false, arg);
};
