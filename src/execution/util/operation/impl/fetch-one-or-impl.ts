import {FetchAllConnection, FetchedRow} from "../../helper-type";
import {QueryBaseUtil} from "../../../../query-base";
import {fetchOneImpl} from "./fetch-one-impl";

export async function fetchOneOrImpl<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated,
    DefaultValueT
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>,
    defaultValue : DefaultValueT
) : (
    Promise<{
        sql : string,
        row : FetchedRow<QueryT>|DefaultValueT,
    }>
) {
    return fetchOneImpl(query, connection)
        .or(defaultValue);
}
