import {CaseValueNode} from "../../case-value-node";
import {isObjectWithOwnEnumerableKeys} from "../../../../type-util";

export function isCaseValueNode (mixed : unknown) : mixed is CaseValueNode {
    if (!isObjectWithOwnEnumerableKeys<CaseValueNode>()(
        mixed,
        [
            "type",
            "value",
            "cases",
            "else"
        ]
    )) {
        return false;
    }
    return (
        mixed.type === "CaseValue"
    );
}
