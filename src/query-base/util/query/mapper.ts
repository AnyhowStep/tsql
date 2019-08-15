import * as tm from "type-mapping";
import {OneSelectItem, ZeroOrOneRow} from "../helper-type";
import {TypeOf} from "./type-of";
import {isOneRow} from "../predicate";

export type Mapper<
    QueryT extends OneSelectItem<unknown> & ZeroOrOneRow
> = (
    tm.SafeMapper<TypeOf<QueryT>>
);
export function mapper<
    QueryT extends OneSelectItem<unknown> & ZeroOrOneRow
> (
    query : QueryT
) : (
    Mapper<QueryT>
) {
    if (isOneRow(query)) {
        return query.selectClause[0].mapper as Mapper<QueryT>;
    } else {
        return tm.orNull(query.selectClause[0].mapper) as Mapper<QueryT>;
    }
}
