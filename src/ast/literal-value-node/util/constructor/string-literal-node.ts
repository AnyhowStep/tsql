import {LiteralValueType, StringLiteralNode} from "../../literal-value-node";

export function stringLiteralNode (
    literalValue : string
) : StringLiteralNode {
    return {
        type : "LiteralValue",
        literalValueType : LiteralValueType.STRING,
        literalValue,
    };
}
