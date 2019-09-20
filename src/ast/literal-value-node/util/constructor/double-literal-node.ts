import {LiteralValueType, DoubleLiteralNode} from "../../literal-value-node";

export function doubleLiteralNode (
    literalValue : number
) : DoubleLiteralNode {
    return {
        type : "LiteralValue",
        literalValueType : LiteralValueType.DOUBLE,
        literalValue,
    };
}
