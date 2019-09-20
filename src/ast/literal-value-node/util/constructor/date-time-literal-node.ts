import {LiteralValueType, DateTimeLiteralNode} from "../../literal-value-node";

export function dateTimeLiteralNode (
    literalValue : Date
) : DateTimeLiteralNode {
    return {
        type : "LiteralValue",
        literalValueType : LiteralValueType.DATE_TIME,
        literalValue,
    };
}
