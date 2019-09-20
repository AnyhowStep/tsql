import {LiteralValueType, BooleanLiteralNode} from "../../literal-value-node";

export function booleanLiteralNode (
    literalValue : boolean
) : BooleanLiteralNode {
    return {
        type : "LiteralValue",
        literalValueType : LiteralValueType.BOOLEAN,
        literalValue,
    };
}
