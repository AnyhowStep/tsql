import {AnySubqueryExpr} from "../../../raw-expr";
import {SortDirection} from "../../../sort-direction";
import {Coalesce, coalesce} from "./coalesce";

export type Sort<
    QueryT extends AnySubqueryExpr
> =
    readonly [Coalesce<QueryT, null>, SortDirection]
;
export function sort<
    QueryT extends AnySubqueryExpr
> (query : QueryT, sortDirection : SortDirection) : Sort<QueryT> {
    return [
        coalesce<QueryT, null>(
            query,
            null
        ),
        sortDirection
    ];
}
