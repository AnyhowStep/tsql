import {QueryBaseUtil} from "../../../../query-base";
import {SelectConnection} from "../../../connection";
import {trySetLimit2} from "./try-set-limit-2";
import {fetchValueArrayImpl} from "./fetch-value-array-impl";
import {ensureOne} from "./ensure-one";

export async function fetchValueImpl<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : (
    Promise<{
        sql : string,
        value : QueryBaseUtil.TypeOfSelectItem<QueryT>,
    }>
) {
    const limitedQuery = trySetLimit2(query);
    const fetched = await fetchValueArrayImpl<QueryT>(limitedQuery, connection);
    return {
        sql : fetched.sql,
        value : ensureOne(limitedQuery, fetched),
    };
}
