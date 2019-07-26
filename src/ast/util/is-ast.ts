import {Ast} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";

/**
 * A type guard for the `Ast` type
 *
 * @param raw
 */
export function isAst (raw : unknown) : raw is Ast {
    if (typeof raw == "string") {
        return true;
    }
    if (Parentheses.IsParentheses(raw)) {
        return true;
    }
    if (FunctionCall.IsFunctionCall(raw)) {
        return true;
    }
    if (Array.isArray(raw)) {
        for (const item of raw) {
            if (!isAst(item)) {
                return false;
            }
        }
        return true;
    }
    return false;
}
