import {LiteralValueNode, literalValueTypeElements} from "../../literal-value-node";
import {isObjectWithOwnEnumerableKeys} from "../../../../type-util";

/**
 * Does not check for `precision` and `scale` for `DecimalLiteralNode`.
 * Just assumes it exists.
 */
export function isLiteralValueNode (mixed : unknown) : mixed is LiteralValueNode {
    if (!isObjectWithOwnEnumerableKeys<Pick<LiteralValueNode, "type"|"literalValueType"|"literalValue">>()(
        mixed,
        [
            "type",
            "literalValueType",
            "literalValue"
        ]
    )) {
        return false;
    }
    return (
        mixed.type === "LiteralValue" &&
        literalValueTypeElements.includes(mixed.literalValueType as any)
    );
}
