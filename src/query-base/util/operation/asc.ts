import {AnySubqueryExpr} from "../../../raw-expr";
import {SortDirection} from "../../../sort-direction";
import {Coalesce, coalesce} from "./coalesce";

export type Asc<
    QueryT extends AnySubqueryExpr
> =
    readonly [Coalesce<QueryT, null>, SortDirection.ASC]
;
export function asc<
    QueryT extends AnySubqueryExpr
> (query : QueryT) : Asc<QueryT> {
    return [
        coalesce<QueryT, null>(
            query,
            null
        ),
        SortDirection.ASC
    ];
}
