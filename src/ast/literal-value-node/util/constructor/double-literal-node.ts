import {LiteralValueType, DoubleLiteralNode} from "../../literal-value-node";

export function doubleLiteralNode (
    literalValue : number
) : DoubleLiteralNode {
    if (!isFinite(literalValue)) {
        throw new Error(`Double literal must be finite`);
    }
    return {
        type : "LiteralValue",
        literalValueType : LiteralValueType.DOUBLE,
        literalValue,
    };
}
