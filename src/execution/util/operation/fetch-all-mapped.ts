import {QueryBaseUtil} from "../../../query-base";
import {UnmappedResultSet, MappedResultSet, MappedRow} from "../helper-type";
import {fetchAllUnmapped} from "./fetch-all-unmapped";
import {IsolableSelectConnection} from "../../connection";

export async function fetchAllMapped<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated & QueryBaseUtil.Mapped
>(
    query : QueryT,
    /**
     * We need a full `IConnection` to pass to the `MapDelegate`.
     * However, ideally, it would only need to use transaction and `SELECT` statements...
     */
    connection : IsolableSelectConnection
) : Promise<MappedResultSet<QueryT>> {
    const unmappedResultSet : (
        UnmappedResultSet<QueryT>
    ) = await fetchAllUnmapped<QueryT>(
        query, connection
    );
    if (unmappedResultSet.length == 0) {
        return [];
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
    return mappedResultSet;
}
