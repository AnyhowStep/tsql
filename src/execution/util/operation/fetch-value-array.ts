import {QueryBaseUtil} from "../../../query-base";
import {SelectConnection} from "../../connection";
import {fetchValueArrayImpl} from "./fetch-value-array-impl";

export async function fetchValueArray<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : (
    Promise<QueryBaseUtil.TypeOfSelectItem<QueryT>[]>
) {
    return fetchValueArrayImpl(query, connection)
        .then(({resultSet}) => resultSet);
}
