import {FetchAllConnection, FetchedRow} from "../helper-type";
import {QueryBaseUtil} from "../../../query-base";
import {fetchOneOrImpl} from "./impl";

export async function fetchOneOrUndefined<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : Promise<FetchedRow<QueryT>|undefined> {
    return fetchOneOrImpl(query, connection, undefined)
        .then(({row}) => row);
}
