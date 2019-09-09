import {OperatorType, OperatorNode} from "../operator-node";
import {Sqlfier} from "./sqlfier";
import {Ast, AstArray} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";

export type OperatorSqlfier = {
    readonly [operatorType in OperatorType] : (
        op : OperatorNode<operatorType>,
        toSql : (ast : Ast) => string,
        sqlfier : Sqlfier
    ) => string|AstArray|Parentheses|FunctionCall;
};
