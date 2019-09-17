import {IConnection} from "../../../execution";
import {QueryBaseUtil} from "../../../query-base";
import {MappedResultSet, UnmappedFlattenedResultSet} from "../helper-type";
import {fetchAllUnmappedFlattened} from "./fetch-all-unmapped-flattened";
import {fetchAllMapped} from "./fetch-all-mapped";

/**
 * Combines `fetchAllUnmappedFlattened()` and `fetchAllMapped()` for convenience.
 */
export function fetchAll<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated & QueryBaseUtil.Mapped
>(
    query : QueryT,
    connection : IConnection
) : Promise<MappedResultSet<QueryT>>;
export function fetchAll<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated & QueryBaseUtil.Unmapped
>(
    query : QueryT,
    connection : IConnection
) : Promise<UnmappedFlattenedResultSet<QueryT>>;
export function fetchAll (
    query : QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
    connection : IConnection
) : Promise<unknown[]>;
export async function fetchAll (
    query : QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
    connection : IConnection
) : Promise<unknown[]> {
    if (query.mapDelegate == undefined) {
        return fetchAllUnmappedFlattened(
            query,
            connection
        );
    } else {
        return fetchAllMapped(
            query as QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated & QueryBaseUtil.Mapped,
            connection
        );
    }
}
