import {QueryBaseUtil} from "../../../../query-base";
import {SelectConnection} from "../../../connection";
import {trySetLimit2} from "./try-set-limit-2";
import {fetchValueArrayImpl} from "./fetch-value-array-impl";
import {ensureOneOr} from "./ensure-one-or";

export async function fetchValueOrImpl<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated,
    DefaultValueT
>(
    query : QueryT,
    connection : SelectConnection,
    defaultValue : DefaultValueT
) : (
    Promise<{
        sql : string,
        value : QueryBaseUtil.TypeOfSelectItem<QueryT>|DefaultValueT,
    }>
) {
    const limitedQuery = trySetLimit2(query);
    const fetched = await fetchValueArrayImpl<QueryT>(limitedQuery, connection);
    return {
        sql : fetched.sql,
        value : ensureOneOr(limitedQuery, fetched, defaultValue),
    };
}
