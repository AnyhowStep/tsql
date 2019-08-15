import {IQueryBase} from "../../query-base";
import {isObjectWithOwnEnumerableKeys} from "../../../type-util";
//import {UsedRefUtil} from "../../../used-ref";
//import {AstUtil} from "../../../ast";

/**
 * Only checks that the properties exist.
 * Does not actually check that they are the right data type!
 *
 * @todo Consider adding checks for increased type safety.
 */
export function isQuery (x : unknown) : x is IQueryBase {
    if (!isObjectWithOwnEnumerableKeys<IQueryBase>()(
        x,
        [
            "fromClause",
            "selectClause",

            "limitClause",

            "unionClause",
            "unionLimitClause",

            "buildExprAst",
        ]
    )) {
        return false;
    }
    return true;
}
