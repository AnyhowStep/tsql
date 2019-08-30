import {RawOrder, SortExpr} from "../../order";
import {SortDirection} from "../../../sort-direction";
import {isOrder} from "../predicate";

export type FromRawOrder<RawOrderT extends RawOrder> =
    RawOrderT extends SortExpr ?
    [RawOrderT, SortDirection.ASC] :
    RawOrderT
;
export function fromRawOrder<
    RawOrderT extends RawOrder
> (
    rawOrder : RawOrderT
) : (
    FromRawOrder<RawOrderT>
) {
    if (isOrder(rawOrder)) {
        return rawOrder as FromRawOrder<RawOrderT>;
    } else {
        return [rawOrder, SortDirection.ASC] as FromRawOrder<RawOrderT>;
    }
}
