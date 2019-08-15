import {IFromClause} from "../../from-clause";
import {isObjectWithOwnEnumerableKeys} from "../../../type-util";
//import {UsedRefUtil} from "../../../used-ref";
//import {AstUtil} from "../../../ast";

/**
 * Only checks that the properties exist.
 * Does not actually check that they are the right data type!
 *
 * @todo Consider adding checks for increased type safety.
 */
export function isFromClause (x : unknown) : x is IFromClause {
    if (!isObjectWithOwnEnumerableKeys<IFromClause>()(
        x,
        [
            "outerQueryJoins",
            "currentJoins",
        ]
    )) {
        return false;
    }
    return true;
}
