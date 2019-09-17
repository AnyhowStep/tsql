import {QueryBaseUtil} from "../../../query-base";
import {UnmappedResultSet, MappedResultSet, MappedRow} from "../helper-type";
import {IsolableSelectConnection} from "../../connection";
import {fetchAllUnmappedImpl} from "./fetch-all-unmapped-impl";

export async function fetchAllMappedImpl<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated & QueryBaseUtil.Mapped
>(
    query : QueryT,
    /**
     * We need a full `IConnection` to pass to the `MapDelegate`.
     * However, ideally, it would only need to use transaction and `SELECT` statements...
     */
    connection : IsolableSelectConnection
) : (
    Promise<{
        sql : string,
        resultSet : MappedResultSet<QueryT>,
    }>
) {
    const unmapped = await fetchAllUnmappedImpl(query, connection);
    const unmappedResultSet : UnmappedResultSet<QueryT> = unmapped.resultSet;
    if (unmappedResultSet.length == 0) {
        return unmapped as {
            sql : string,
            resultSet : MappedResultSet<QueryT>,
        };
    }

    const mappedResultSet : MappedResultSet<QueryT> = [];
    for (const unmappedRow of unmappedResultSet) {
        mappedResultSet.push(
            await query.mapDelegate(
                unmappedRow as never,
                connection,
                unmappedRow as never
            ) as MappedRow<QueryT>
        );
    }
    return {
        sql : unmapped.sql,
        resultSet : mappedResultSet,
    };
}
