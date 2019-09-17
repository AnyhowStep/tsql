import {QueryBaseUtil} from "../../../query-base";
import {RawRow, UnmappedFlattenedResultSet} from "../helper-type";
import {fetchAllUnmapped} from "./fetch-all-unmapped";
import {canFlattenUnmappedRow} from "../predicate";
import {SelectConnection} from "../../connection";

export async function fetchAllUnmappedFlattened<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : Promise<UnmappedFlattenedResultSet<QueryT>> {
    const unmappedResultSet : (
        RawRow[]
    ) = await fetchAllUnmapped<QueryT>(
        query, connection
    );
    if (unmappedResultSet.length == 0) {
        return [];
    }

    if (!canFlattenUnmappedRow(query)) {
        return unmappedResultSet as UnmappedFlattenedResultSet<QueryT>;
    }

    return unmappedResultSet.map(unmappedRow => {
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
    }) as UnmappedFlattenedResultSet<QueryT>;
}
