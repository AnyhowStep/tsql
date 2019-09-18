import {QueryBaseUtil} from "../../../../query-base";
import {SelectConnection} from "../../../connection";
import {fetchAllUnmappedImpl} from "./fetch-all-unmapped-impl";

export async function fetchValueArrayImpl<
    QueryT extends QueryBaseUtil.OneSelectItem<any> & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : (
    Promise<{
        sql : string,
        resultSet : QueryBaseUtil.TypeOfSelectItem<QueryT>[],
    }>
) {
    if (!QueryBaseUtil.isOneSelectItem(query)) {
        throw new Error(`Expected query with one select item`);
    }

    const unmapped = await fetchAllUnmappedImpl(query, connection);
    const resultSet : Record<string, Record<string, unknown>>[] = unmapped.resultSet;
    if (resultSet.length == 0) {
        return {
            sql : unmapped.sql,
            resultSet : [],
        };
    }

    /**
     * This should always be a `string` if
     * `isOneSelectItem()` and `fetchAllUnmappedImpl()` are working
     * correctly.
     */
    const tableAlias = Object.keys(resultSet[0])[0];
    const columnAlias = Object.keys(resultSet[0][tableAlias])[0];
    return {
        sql : unmapped.sql,
        resultSet : resultSet.map((row) => row[tableAlias][columnAlias]) as QueryBaseUtil.TypeOfSelectItem<QueryT>[],
    };
}
