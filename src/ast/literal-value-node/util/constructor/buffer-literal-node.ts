import {LiteralValueType, BufferLiteralNode} from "../../literal-value-node";

export function bufferLiteralNode (
    literalValue : Buffer
) : BufferLiteralNode {
    return {
        type : "LiteralValue",
        literalValueType : LiteralValueType.BUFFER,
        literalValue,
    };
}
