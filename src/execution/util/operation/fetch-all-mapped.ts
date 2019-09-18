import {QueryBaseUtil} from "../../../query-base";
import {MappedResultSet} from "../helper-type";
import {IsolableSelectConnection} from "../../connection";
import {fetchAllMappedImpl} from "./impl";

export async function fetchAllMapped<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated & QueryBaseUtil.Mapped
>(
    query : QueryT,
    /**
     * We need a full `IConnection` to pass to the `MapDelegate`.
     * However, ideally, it would only need to use transaction and `SELECT` statements...
     */
    connection : IsolableSelectConnection
) : Promise<MappedResultSet<QueryT>> {
    return fetchAllMappedImpl(query, connection)
        .then(({resultSet}) => resultSet);
}
