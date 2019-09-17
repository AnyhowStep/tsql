import {QueryBaseUtil} from "../../../query-base";
import {FetchAllConnection, FetchedResultSet} from "../helper-type";
import {fetchAllUnmappedFlattened} from "./fetch-all-unmapped-flattened";
import {fetchAllMapped} from "./fetch-all-mapped";
import {IsolableSelectConnection, SelectConnection} from "../../connection";

/**
 * Combines `fetchAllUnmappedFlattened()` and `fetchAllMapped()` for convenience.
 */
export function fetchAll<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : Promise<FetchedResultSet<QueryT>> {
    if (query.mapDelegate == undefined) {
        return fetchAllUnmappedFlattened(
            query as QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
            connection as SelectConnection
        ) as Promise<FetchedResultSet<QueryT>>;
    } else {
        return fetchAllMapped(
            query as QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated & QueryBaseUtil.Mapped,
            connection as IsolableSelectConnection
        ) as Promise<FetchedResultSet<QueryT>>;
    }
}
