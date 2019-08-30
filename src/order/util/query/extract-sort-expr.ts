import {RawOrder, Order} from "../../order";
import {isOrder} from "../predicate";

export type ExtractSortExpr<RawOrderT extends RawOrder> =
    RawOrderT extends Order ?
    RawOrderT[0] :
    RawOrderT
;
export function extractSortExpr<
    RawOrderT extends RawOrder
> (
    rawOrder : RawOrderT
) : (
    ExtractSortExpr<RawOrderT>
) {
    if (isOrder(rawOrder)) {
        return rawOrder[0] as ExtractSortExpr<RawOrderT>;
    } else {
        return rawOrder as ExtractSortExpr<RawOrderT>;
    }
}
