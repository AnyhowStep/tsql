import {AnySubqueryExpr} from "../../../built-in-expr";
import {SortDirection} from "../../../sort-direction";
import {Coalesce, coalesce} from "./coalesce";

export type Desc<
    QueryT extends AnySubqueryExpr
> =
    readonly [Coalesce<QueryT, null>, SortDirection.DESC]
;
export function desc<
    QueryT extends AnySubqueryExpr
> (query : QueryT) : Desc<QueryT> {
    return [
        coalesce<QueryT, null>(
            query,
            null
        ),
        SortDirection.DESC
    ];
}
