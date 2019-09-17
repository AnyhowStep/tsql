import {QueryBaseUtil} from "../../../query-base";
import {FetchAllConnection, FetchedResultSet} from "../helper-type";
import {fetchAllImpl} from "./fetch-all-impl";

/**
 * Combines `fetchAllUnmappedFlattened()` and `fetchAllMapped()` for convenience.
 */
export function fetchAll<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : Promise<FetchedResultSet<QueryT>> {
    return fetchAllImpl(query, connection)
        .then(({resultSet}) => resultSet);
}
