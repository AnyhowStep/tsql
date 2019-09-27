import {AstArray, Ast} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";
import {Sqlfier} from "./sqlfier";
import {CaseValueNode} from "../case-value-node";

export interface CaseValueSqlfier {
    (
        node : CaseValueNode,
        toSql : (ast : Ast) => string,
        sqlfier : Sqlfier
    ) : string|AstArray|Parentheses|FunctionCall
}
