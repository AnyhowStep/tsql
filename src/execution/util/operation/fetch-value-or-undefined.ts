import {QueryBaseUtil} from "../../../query-base";
import {SelectConnection} from "../../connection";
import {fetchValueOrImpl} from "./impl";

export async function fetchValueOrUndefined<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : (
    Promise<QueryBaseUtil.TypeOfSelectItem<QueryT>|undefined>
) {
    return fetchValueOrImpl(query, connection, undefined)
        .then(({value}) => value);
}
