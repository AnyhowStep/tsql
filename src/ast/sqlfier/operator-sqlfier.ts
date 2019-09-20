import {OperatorNode} from "../operator-node";
import {Sqlfier} from "./sqlfier";
import {Ast, AstArray} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";
import {OperatorType} from "../../operator-type";
import {LiteralValueNode} from "../literal-value-node";

export type OperatorSqlfier = {
    readonly [operatorType in OperatorType] : (
        op : OperatorNode<operatorType>,
        toSql : (ast : Ast) => string,
        sqlfier : Sqlfier
    ) => string|AstArray|Parentheses|FunctionCall|LiteralValueNode;
};
