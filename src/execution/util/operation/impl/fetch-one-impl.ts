import {FetchAllConnection, FetchedRow} from "../../helper-type";
import {QueryBaseUtil} from "../../../../query-base";
import {trySetLimit2} from "./try-set-limit-2";
import {fetchAllImpl} from "./fetch-all-impl";
import {ensureOne} from "./ensure-one";

export async function fetchOneImpl<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : FetchAllConnection<QueryT>
) : (
    Promise<{
        sql : string,
        row : FetchedRow<QueryT>,
    }>
) {
    const limitedQuery = trySetLimit2(query);

    const fetched = await fetchAllImpl<QueryT>(limitedQuery, connection);
    return {
        sql : fetched.sql,
        row : ensureOne(limitedQuery, fetched),
    };
}
