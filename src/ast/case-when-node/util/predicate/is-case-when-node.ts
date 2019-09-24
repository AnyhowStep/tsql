import {CaseWhenNode} from "../../case-when-node";
import {isObjectWithOwnEnumerableKeys} from "../../../../type-util";

export function isCaseWhenNode (mixed : unknown) : mixed is CaseWhenNode {
    if (!isObjectWithOwnEnumerableKeys<CaseWhenNode>()(
        mixed,
        [
            "type",
            "branches",
            "else"
        ]
    )) {
        return false;
    }
    return (
        mixed.type === "CaseWhen"
    );
}
