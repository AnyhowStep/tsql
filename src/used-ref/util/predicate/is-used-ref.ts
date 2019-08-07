import {IUsedRef} from "../../used-ref";
import {isObjectWithOwnEnumerableKeys} from "../../../type-util";
//import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";

/**
 * Does not actually check that `x.columns` is a `ColumnIdentifierRef`.
 *
 * @todo Consider adding check for increased type safety.
 */
export function isUsedRef  (x : unknown) : x is IUsedRef {
    if (!isObjectWithOwnEnumerableKeys<IUsedRef>()(
        x,
        [
            "__contravarianceMarker",
            "columns",
        ]
    )) {
        return false;
    }
    return (
        (typeof x.__contravarianceMarker == "function")// &&
        //(ColumnIdentifierRefUtil.isColumnIdentifierRef(x.usedRef))
    );
}
