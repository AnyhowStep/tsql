import {OperatorNode} from "../../operator-node";
import {isObjectWithOwnEnumerableKeys} from "../../../../type-util";

export function isOperatorNode (mixed : unknown) : mixed is OperatorNode {
    if (!isObjectWithOwnEnumerableKeys<OperatorNode>()(
        mixed,
        [
            "type",
            "operatorType",
            "operands",
        ]
    )) {
        return false;
    }
    return (
        mixed.type === "Operator"
    );
}
