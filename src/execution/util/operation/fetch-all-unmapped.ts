import {QueryBaseUtil} from "../../../query-base";
import {UnmappedResultSet} from "../helper-type";
import {SelectConnection} from "../../connection";
import {fetchAllUnmappedImpl} from "./impl";

export async function fetchAllUnmapped<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : (
    Promise<UnmappedResultSet<QueryT>>
) {
    return fetchAllUnmappedImpl(query, connection)
        .then(({resultSet}) => resultSet);
}
