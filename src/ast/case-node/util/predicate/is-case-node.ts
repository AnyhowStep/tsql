import {CaseNode} from "../../case-node";
import {isObjectWithOwnEnumerableKeys} from "../../../../type-util";

export function isCaseNode (mixed : unknown) : mixed is CaseNode {
    if (!isObjectWithOwnEnumerableKeys<CaseNode>()(
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
        mixed.type === "Case"
    );
}
