import * as tm from "type-mapping";
import {AnyBuiltInExpr} from "../../raw-expr";
import {Ast, parentheses, LiteralValueNodeUtil} from "../../../ast";
import {ExprUtil} from "../../../expr";
import {ColumnUtil} from "../../../column";
import {QueryBaseUtil} from "../../../query-base";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {isDate} from "../../../date-util";

/**
 * + `bigint` is considered a `signed bigint` by this library.
 * +`DECIMAL` is not supported by this function.
 * +`UNSIGNED BIGINT` is not supported by this function.
 */
export function buildAst (builtInExpr : AnyBuiltInExpr|QueryBaseUtil.OneSelectItem<any>) : Ast {
    //Check built-in cases first
    if (typeof builtInExpr == "number") {
        return LiteralValueNodeUtil.doubleLiteralNode(builtInExpr);
    }
    if (tm.TypeUtil.isBigInt(builtInExpr)) {
        return LiteralValueNodeUtil.signedBigIntLiteralNode(builtInExpr);
    }
    if (typeof builtInExpr == "string") {
        return LiteralValueNodeUtil.stringLiteralNode(builtInExpr);
    }
    if (typeof builtInExpr == "boolean") {
        return LiteralValueNodeUtil.booleanLiteralNode(builtInExpr);
    }
    if (isDate(builtInExpr)) {
        return LiteralValueNodeUtil.dateTimeLiteralNode(builtInExpr);
    }
    if (builtInExpr instanceof Uint8Array) {
        //escape(Buffer.from("hello")) == "X'68656c6c6f'"
        return LiteralValueNodeUtil.bufferLiteralNode(builtInExpr);
    }
    if (builtInExpr === null) {
        return LiteralValueNodeUtil.nullLiteralNode(builtInExpr);
    }

    if (ExprUtil.isExpr(builtInExpr)) {
        return builtInExpr.ast;
    }

    if (ColumnUtil.isColumn(builtInExpr)) {
        return ColumnUtil.buildAst(builtInExpr);
    }

    if (QueryBaseUtil.isOneSelectItem(builtInExpr)) {
        /**
         * @todo Check if this is desirable
         */
        //return builtInExpr.buildExprAst();
        return parentheses(builtInExpr, false/*canUnwrap*/);
    }

    if (ExprSelectItemUtil.isExprSelectItem(builtInExpr)) {
        /**
         * @todo Check if this is desirable.
         * If anything, the `query` ast, when used as a value query,
         * should wrap an unwrappable parentheses around itself.
         */
        //return Parentheses.Create(builtInExpr.unaliasedAst, false/*canUnwrap*/);
        return parentheses(builtInExpr.unaliasedAst);
    }

    throw new Error(`Unknown builtInExpr ${tm.TypeUtil.toTypeStr(builtInExpr)}`);
}
