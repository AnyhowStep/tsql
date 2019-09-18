import {QueryBaseUtil} from "../../../query-base";
import {SelectConnection} from "../../connection";
import {fetchValueImpl} from "./impl";

export async function fetchValue<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : (
    Promise<QueryBaseUtil.TypeOfSelectItem<QueryT>>
) {
    return fetchValueImpl(query, connection)
        .then(({value}) => value);
}
