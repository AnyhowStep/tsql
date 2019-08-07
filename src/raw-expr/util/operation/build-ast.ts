import * as tm from "type-mapping";
import {AnyRawExpr} from "../../raw-expr";
import {Ast, Parentheses} from "../../../ast";
import {escapeValue} from "../../../sqlstring";
import {ExprUtil} from "../../../expr";
import {ColumnUtil} from "../../../column";
import {QueryUtil} from "../../../query";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import * as DateTimeUtil from "../../../date-time-util";

export function buildAst (rawExpr : AnyRawExpr) : Ast {
    //Check primitive cases first
    if (typeof rawExpr == "number") {
        //This technically gives us DECIMAL in MySQL,
        //Not double
        return escapeValue(rawExpr);
    }
    if (typeof rawExpr == "bigint") {
        return escapeValue(rawExpr);
    }
    if (typeof rawExpr == "string") {
        return escapeValue(rawExpr);
    }
    if (typeof rawExpr == "boolean") {
        return escapeValue(rawExpr);
    }
    if (rawExpr instanceof Date) {
        return DateTimeUtil.toSqlUtc(rawExpr, 3);
    }
    if (rawExpr instanceof Buffer) {
        //escape(Buffer.from("hello")) == "X'68656c6c6f'"
        return escapeValue(rawExpr);
    }
    if (rawExpr === null) {
        return escapeValue(rawExpr);
    }

    if (ExprUtil.isExpr(rawExpr)) {
        return rawExpr.ast;
    }

    if (ColumnUtil.isColumn(rawExpr)) {
        return ColumnUtil.buildAst(rawExpr);
    }

    if (QueryUtil.isOneSelectItem(rawExpr)) {
        return rawExpr.buildExprAst();
    }

    if (ExprSelectItemUtil.isExprSelectItem(rawExpr)) {
        return Parentheses.Create(rawExpr.unaliasedAst, false/*canUnwrap*/);
    }

    throw new Error(`Unknown rawExpr ${tm.TypeUtil.toTypeStr(rawExpr)}`);
}
