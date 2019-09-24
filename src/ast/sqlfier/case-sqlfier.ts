import {AstArray, Ast} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";
import {Sqlfier} from "./sqlfier";
import {CaseNode} from "../case-node";

export interface CaseSqlfier {
    (
        node : CaseNode,
        toSql : (ast : Ast) => string,
        sqlfier : Sqlfier
    ) : string|AstArray|Parentheses|FunctionCall
}
