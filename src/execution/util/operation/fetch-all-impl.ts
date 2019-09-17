import {QueryBaseUtil} from "../../../query-base";
import {FetchAllConnection, FetchedResultSet} from "../helper-type";
import {IsolableSelectConnection, SelectConnection} from "../../connection";
import {fetchAllUnmappedFlattenedImpl} from "./fetch-all-unmapped-flattened-impl";
import {fetchAllMappedImpl} from "./fetch-all-mapped-impl";

export function fetchAllImpl<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : (
    Promise<{
        sql : string,
        resultSet : FetchedResultSet<QueryT>
    }>
) {
    if (query.mapDelegate == undefined) {
        return fetchAllUnmappedFlattenedImpl(
            query as QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
            connection as SelectConnection
        ) as Promise<{
            sql : string,
            resultSet : FetchedResultSet<QueryT>
        }>;
    } else {
        return fetchAllMappedImpl(
            query as QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated & QueryBaseUtil.Mapped,
            connection as IsolableSelectConnection
        ) as Promise<{
            sql : string,
            resultSet : FetchedResultSet<QueryT>
        }>;
    }
}
