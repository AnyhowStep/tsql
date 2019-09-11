import * as tm from "type-mapping";
import {AnyRawExpr} from "../../raw-expr";
import {Ast, parentheses} from "../../../ast";
import {escapeValue} from "../../../sqlstring";
import {ExprUtil} from "../../../expr";
import {ColumnUtil} from "../../../column";
import {QueryBaseUtil} from "../../../query-base";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import * as DateTimeUtil from "../../../date-time-util";
import {operatorNode1} from "../../../ast/operator-node/util";
import {OperatorType} from "../../../operator-type";

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
        return operatorNode1(
            OperatorType.UTC_STRING_TO_TIMESTAMP_CONSTRUCTOR,
            [DateTimeUtil.toSqlUtc(rawExpr, 3)]
        );
    }
    if (Buffer.isBuffer(rawExpr)) {
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

    if (QueryBaseUtil.isOneSelectItem(rawExpr)) {
        /**
         * @todo Check if this is desirable
         */
        //return rawExpr.buildExprAst();
        return parentheses(rawExpr, false/*canUnwrap*/)
    }

    if (ExprSelectItemUtil.isExprSelectItem(rawExpr)) {
        /**
         * @todo Check if this is desirable.
         * If anything, the `query` ast, when used as a value query,
         * should wrap an unwrappable parentheses around itself.
         */
        //return Parentheses.Create(rawExpr.unaliasedAst, false/*canUnwrap*/);
        return parentheses(rawExpr.unaliasedAst);
    }

    throw new Error(`Unknown rawExpr ${tm.TypeUtil.toTypeStr(rawExpr)}`);
}
