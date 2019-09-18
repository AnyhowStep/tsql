import {QueryBaseUtil} from "../../../query-base";
import {UnmappedFlattenedResultSet} from "../helper-type";
import {SelectConnection} from "../../connection";
import {fetchAllUnmappedFlattenedImpl} from "./impl";

export async function fetchAllUnmappedFlattened<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : Promise<UnmappedFlattenedResultSet<QueryT>> {
    return fetchAllUnmappedFlattenedImpl(query, connection)
        .then(({resultSet}) => resultSet);
}
