import {decimalMapper} from "../decimal-mapper";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {BuiltInExpr} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {Decimal} from "../../../decimal";

const sumImpl = makeOperator2<OperatorType.AGGREGATE_SUM, boolean, Decimal, Decimal|null>(
    OperatorType.AGGREGATE_SUM,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);

export const sumDistinct : Operator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return sumImpl(true, arg);
};

export const sumAll : Operator1<Decimal, Decimal|null> = <
    ArgT extends BuiltInExpr<Decimal>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return sumImpl(false, arg);
};
