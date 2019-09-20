import {
    LiteralValueNode,
    LiteralValueType,
} from "../literal-value-node";
import {AstArray, Ast} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";
import {Sqlfier} from "./sqlfier";

export type LiteralValueToSql<TypeT extends LiteralValueType> =
    (
        node : Extract<LiteralValueNode, { literalValueType : TypeT }>,
        toSql : (ast : Ast) => string,
        sqlfier : Sqlfier
    ) => string|AstArray|Parentheses|FunctionCall
;

export type LiteralValueSqlfier = {
    [literalValueType in LiteralValueType] : LiteralValueToSql<literalValueType>;
}
