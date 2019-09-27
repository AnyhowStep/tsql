import {AstArray, Ast} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";
import {Sqlfier} from "./sqlfier";
import {CaseConditionNode} from "../case-when-node";

export interface CaseConditionSqlfier {
    (
        node : CaseConditionNode,
        toSql : (ast : Ast) => string,
        sqlfier : Sqlfier
    ) : string|AstArray|Parentheses|FunctionCall
}
