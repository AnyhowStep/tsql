import {QueryBaseUtil} from "../../../query-base";
import {SelectConnection} from "../../connection";
import {fetchValueOrImpl} from "./impl";

export async function fetchValueOr<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated,
    DefaultValueT
>(
    query : QueryT,
    connection : SelectConnection,
    defaultValue : DefaultValueT
) : (
    Promise<QueryBaseUtil.TypeOfSelectItem<QueryT>|DefaultValueT>
) {
    return fetchValueOrImpl(query, connection, defaultValue)
        .then(({value}) => value);
}
