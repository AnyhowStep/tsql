import {FetchAllConnection, FetchedRow} from "../../helper-type";
import {QueryBaseUtil} from "../../../../query-base";
import {fetchAllImpl} from "./fetch-all-impl";
import {trySetLimit2} from "./try-set-limit-2";
import {ensureOneOr} from "./ensure-one-or";

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
    const limitedQuery = trySetLimit2(query);

    const fetched = await fetchAllImpl<QueryT>(limitedQuery, connection);
    return {
        sql : fetched.sql,
        row : ensureOneOr(limitedQuery, fetched, defaultValue),
    };
}
