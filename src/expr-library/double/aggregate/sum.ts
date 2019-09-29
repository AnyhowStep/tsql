import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator2, Operator1} from "../../factory";
import {RawExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";

const sumImpl = makeOperator2<OperatorType.AGGREGATE_SUM, boolean, number, number|null>(
    OperatorType.AGGREGATE_SUM,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);

export const sumDistinct : Operator1<number, number|null> = <
    ArgT extends RawExpr<number>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<number|null, ArgT>
) => {
    return sumImpl(true, arg);
};

export const sumAll : Operator1<number, number|null> = <
    ArgT extends RawExpr<number>
>(
    arg : ArgT
) : (
    ExprUtil.Intersect<number|null, ArgT>
) => {
    return sumImpl(false, arg);
};
