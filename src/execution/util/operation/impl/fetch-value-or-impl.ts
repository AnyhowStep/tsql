import {QueryBaseUtil} from "../../../../query-base";
import {SelectConnection} from "../../../connection";
import {fetchValueImpl} from "./fetch-value-impl";

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
    return fetchValueImpl(query, connection)
        .or(defaultValue);
}
