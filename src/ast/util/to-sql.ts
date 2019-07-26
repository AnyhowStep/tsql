import {Ast} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";

/**
 * Converts an AST to a SQL string.
 *
 * **DOES NOT** prettify the output.
 *
 * @see {@link toSqlPretty} for prettified output.
 *
 * @param ast
 */
export function toSql (ast : Ast) : string {
    if (Parentheses.IsParentheses(ast)) {
        return ast.toSql();
    } else if (FunctionCall.IsFunctionCall(ast)) {
        return ast.toSql();
    } else if (typeof ast == "string") {
        return ast;
    } else {
        return ast.map(toSql).join("\n");
    }
}