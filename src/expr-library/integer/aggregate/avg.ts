import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {Decimal} from "../../../decimal";
import {RawExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";

const avgImpl = makeOperator2<OperatorType.AGGREGATE_AVERAGE, boolean, bigint, Decimal|null>(
    OperatorType.AGGREGATE_AVERAGE,
    tm.mysql.decimal().orNull(),
    TypeHint.BIGINT_SIGNED
);

export const avgDistinct : Operator1<bigint, Decimal|null> = <
    ArgT extends RawExpr<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return avgImpl(true, arg);
};

export const avgAll : Operator1<bigint, Decimal|null> = <
    ArgT extends RawExpr<bigint>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<Decimal|null, ArgT>
) => {
    return avgImpl(false, arg);
};
