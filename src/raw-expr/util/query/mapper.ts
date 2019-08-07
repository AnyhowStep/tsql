import * as tm from "type-mapping";
import {AnyRawExpr} from "../../raw-expr";
import {TypeOf} from "./type-of";
import {ExprUtil} from "../../../expr";
import {ColumnUtil} from "../../../column";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {QueryUtil} from "../../../query";

export type Mapper<RawExprT extends AnyRawExpr> = (
    tm.SafeMapper<TypeOf<RawExprT>>
);
export function mapper<RawExprT extends AnyRawExpr> (
    rawExpr : RawExprT
) : (
    Mapper<RawExprT>
) {
    //Check primitive cases first
    if (typeof rawExpr == "number") {
        return tm.mysql.double() as tm.AnySafeMapper as Mapper<RawExprT>;
    }
    if (typeof rawExpr == "bigint") {
        return tm.toBigInt() as tm.AnySafeMapper as Mapper<RawExprT>;
    }
    if (typeof rawExpr == "string") {
        return tm.literal(rawExpr) as tm.AnySafeMapper as Mapper<RawExprT>;
    }
    if (typeof rawExpr == "boolean") {
        return (
            //eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            rawExpr ?
                tm.mysql.true() :
                tm.mysql.false()
        ) as tm.AnySafeMapper as Mapper<RawExprT>;
    }
    if (rawExpr instanceof Date) {
        return tm.mysql.dateTime(3) as tm.AnySafeMapper as Mapper<RawExprT>;
    }
    if (rawExpr instanceof Buffer) {
        return tm.instanceOfBuffer() as tm.AnySafeMapper as Mapper<RawExprT>;
    }
    if (rawExpr === null) {
        return tm.null() as tm.AnySafeMapper as Mapper<RawExprT>;
    }

    if (ExprUtil.isExpr(rawExpr)) {
        return rawExpr.mapper as tm.AnySafeMapper as Mapper<RawExprT>;
    }

    if (ColumnUtil.isColumn(rawExpr)) {
        return rawExpr.mapper as tm.AnySafeMapper as Mapper<RawExprT>;
    }

    if (
        QueryUtil.isOneSelectItem(rawExpr) &&
        QueryUtil.isZeroOrOneRow(rawExpr)
    ) {
        return QueryUtil.mapper(rawExpr) as tm.AnySafeMapper as Mapper<RawExprT>;
    }

    if (ExprSelectItemUtil.isExprSelectItem(rawExpr)) {
        return rawExpr.mapper as tm.AnySafeMapper as Mapper<RawExprT>;
    }

    throw new Error(`Unknown rawExpr ${tm.TypeUtil.toTypeStr(rawExpr)}`);
}
