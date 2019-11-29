import * as tm from "type-mapping";
import {AnyBuiltInExpr} from "../../built-in-expr";
import {TypeOf} from "./type-of";
import {ExprUtil} from "../../../expr";
import {ColumnUtil} from "../../../column";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {QueryBaseUtil} from "../../../query-base";
import {isDate} from "../../../date-util";

export type Mapper<BuiltInExprT extends AnyBuiltInExpr> = (
    tm.SafeMapper<TypeOf<BuiltInExprT>>
);
export function mapper<BuiltInExprT extends AnyBuiltInExpr> (
    builtInExpr : BuiltInExprT
) : (
    Mapper<BuiltInExprT>
) {
    //Check built-in cases first
    if (typeof builtInExpr == "number") {
        return tm.mysql.double() as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }
    if (tm.TypeUtil.isBigInt(builtInExpr)) {
        return tm.toBigInt() as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }
    if (typeof builtInExpr == "string") {
        return tm.string() as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }
    if (typeof builtInExpr == "boolean") {
        return (
            //eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            builtInExpr ?
                tm.mysql.true() :
                tm.mysql.false()
        ) as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }
    if (isDate(builtInExpr)) {
        return tm.mysql.dateTime(3) as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }
    if (builtInExpr instanceof Uint8Array) {
        return tm.instanceOfUint8Array() as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }
    if (builtInExpr === null) {
        return tm.null() as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }

    if (ExprUtil.isExpr(builtInExpr)) {
        return builtInExpr.mapper as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }

    if (ColumnUtil.isColumn(builtInExpr)) {
        return builtInExpr.mapper as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }

    if (
        QueryBaseUtil.isOneSelectItem(builtInExpr) &&
        QueryBaseUtil.isZeroOrOneRow(builtInExpr)
    ) {
        return QueryBaseUtil.mapper(builtInExpr) as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }

    if (ExprSelectItemUtil.isExprSelectItem(builtInExpr)) {
        return builtInExpr.mapper as tm.AnySafeMapper as Mapper<BuiltInExprT>;
    }

    throw new Error(`Unknown builtInExpr ${tm.TypeUtil.toTypeStr(builtInExpr)}`);
}
