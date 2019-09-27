import {CaseConditionNode} from "../../case-condition-node";
import {isObjectWithOwnEnumerableKeys} from "../../../../type-util";

export function isCaseConditionNode (mixed : unknown) : mixed is CaseConditionNode {
    if (!isObjectWithOwnEnumerableKeys<CaseConditionNode>()(
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
        mixed.type === "CaseCondition"
    );
}
