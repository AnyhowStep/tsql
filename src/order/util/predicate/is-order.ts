import {Order} from "../../order";
import {SortDirectionUtil} from "../../../sort-direction";

/**
 * Checks,
 * + If it is an 2-tuple
 * + If the second element is a `SortDirection`
 *
 * Does not check,
 * + If the first element is a `SortExpr` (for run-time performance)
 *
 * @param mixed
 */
export function isOrder (mixed : unknown) : mixed is Order {
    return (
        Array.isArray(mixed) &&
        mixed.length == 2 &&
        SortDirectionUtil.isSortDirection(mixed[1])
    );
}
