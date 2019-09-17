import {FetchAllConnection, FetchedRow} from "../helper-type";
import {QueryBaseUtil} from "../../../query-base";
import {fetchOneImpl} from "./fetch-one-impl";

export async function fetchOne<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : Promise<FetchedRow<QueryT>> {
    return fetchOneImpl(query, connection)
        .then(({row}) => row);
}
