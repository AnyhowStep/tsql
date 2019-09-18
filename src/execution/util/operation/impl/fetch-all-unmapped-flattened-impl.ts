import {QueryBaseUtil} from "../../../../query-base";
import {RawRow, UnmappedFlattenedResultSet} from "../../helper-type";
import {canFlattenUnmappedRow} from "../../predicate";
import {SelectConnection} from "../../../connection";
import {fetchAllUnmappedImpl} from "./fetch-all-unmapped-impl";

export async function fetchAllUnmappedFlattenedImpl<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : (
    Promise<{
        sql : string,
        resultSet : UnmappedFlattenedResultSet<QueryT>,
    }>
) {
    const unmapped = await fetchAllUnmappedImpl(query, connection);
    const unmappedResultSet : RawRow[] = unmapped.resultSet;
    if (unmappedResultSet.length == 0 || !canFlattenUnmappedRow(query)) {
        return unmapped as {
            sql : string,
            resultSet : UnmappedFlattenedResultSet<QueryT>,
        };
    }

    return {
        sql : unmapped.sql,
        resultSet : unmappedResultSet.map(unmappedRow => {
            const flattened : Record<string, unknown> = {};
            for (const tableAlias of Object.keys(unmappedRow)) {
                const table = unmappedRow[tableAlias];
                if (table == undefined) {
                    continue;
                }
                for (const columnAlias of Object.keys(table)) {
                    flattened[columnAlias] = table[columnAlias];
                }
            }
            return flattened;
        }) as UnmappedFlattenedResultSet<QueryT>,
    };
}
