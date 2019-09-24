import {AstArray, Ast} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";
import {Sqlfier} from "./sqlfier";
import {CaseWhenNode} from "../case-when-node";

export interface CaseWhenSqlfier {
    (
        node : CaseWhenNode,
        toSql : (ast : Ast) => string,
        sqlfier : Sqlfier
    ) : string|AstArray|Parentheses|FunctionCall
}
