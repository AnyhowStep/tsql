import {LiteralValueType, BufferLiteralNode} from "../../literal-value-node";

export function bufferLiteralNode (
    literalValue : Uint8Array
) : BufferLiteralNode {
    return {
        type : "LiteralValue",
        literalValueType : LiteralValueType.BUFFER,
        literalValue,
    };
}
