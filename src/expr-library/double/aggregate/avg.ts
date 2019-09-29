import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {RawExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";

const avgImpl = makeOperator2<OperatorType.AGGREGATE_AVERAGE, boolean, number, number|null>(
    OperatorType.AGGREGATE_AVERAGE,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);

export const avgDistinct : Operator1<number, number|null> = <
    ArgT extends RawExpr<number>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<number|null, ArgT>
) => {
    return avgImpl(true, arg);
};

export const avgAll : Operator1<number, number|null> = <
    ArgT extends RawExpr<number>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<number|null, ArgT>
) => {
    return avgImpl(false, arg);
};
