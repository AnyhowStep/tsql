import {AstArray, Ast} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";
import {Sqlfier} from "./sqlfier";
import {LiteralValueNode} from "../literal-value-node";

export interface ParenthesesSqlfier {
    (
        parentheses : Parentheses,
        toSql : (ast : Ast) => string,
        sqlfier : Sqlfier
    ) : string|AstArray|Parentheses|FunctionCall|LiteralValueNode
}
