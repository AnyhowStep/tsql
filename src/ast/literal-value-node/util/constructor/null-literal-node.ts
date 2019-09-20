import {LiteralValueType, NullLiteralNode} from "../../literal-value-node";

export function nullLiteralNode (
    literalValue : null
) : NullLiteralNode {
    return {
        type : "LiteralValue",
        literalValueType : LiteralValueType.NULL,
        literalValue,
    };
}
