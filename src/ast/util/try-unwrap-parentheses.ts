import {Ast} from "../ast";
import {Parentheses} from "../parentheses";

export function tryUnwrapParentheses (ast : Ast) : Ast {
    if (Parentheses.IsParentheses(ast) && ast.canUnwrap) {
        return ast.ast;
    } else {
        return ast;
    }
}
