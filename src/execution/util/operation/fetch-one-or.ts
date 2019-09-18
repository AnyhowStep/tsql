import {FetchAllConnection, FetchedRow} from "../helper-type";
import {QueryBaseUtil} from "../../../query-base";
import {fetchOneOrImpl} from "./impl";

export async function fetchOneOr<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
    DefaultValueT
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>,
    defaultValue : DefaultValueT
) : Promise<FetchedRow<QueryT>|DefaultValueT> {
    return fetchOneOrImpl(query, connection, defaultValue)
        .then(({row}) => row);
}
