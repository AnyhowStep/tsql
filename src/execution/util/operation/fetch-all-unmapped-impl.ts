import {ColumnRefUtil, ColumnRef} from "../../../column-ref";
import {SEPARATOR} from "../../../constants";
import {QueryBaseUtil} from "../../../query-base";
import {UnmappedResultSet, RawRow} from "../helper-type";
import {SelectConnection} from "../../connection";

export async function fetchAllUnmappedImpl<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
>(
    query : QueryT,
    connection : SelectConnection
) : (
    Promise<{
        sql : string,
        resultSet : UnmappedResultSet<QueryT>,
    }>
) {
    const rawResult = await connection.select(query);

    const hasNullableJoins = (query.fromClause.currentJoins == undefined) ?
        false :
        query.fromClause.currentJoins.some(j => j.nullable);
    const ref : ColumnRef = ColumnRefUtil.fromSelectClause(query.selectClause);

    const rows : RawRow[] = [];
    for (const rawRow of rawResult.rows) {
        const row : RawRow = {};
        for (const k of Object.keys(rawRow)) {
            const parts = k.split(SEPARATOR);
            const tableAlias = parts[0];
            const columnAlias = parts[1];

            const value = ref[tableAlias][columnAlias].mapper(
                `${tableAlias}.${columnAlias}`,
                rawRow[k]
            );
            let table = row[tableAlias];
            if (table == undefined) {
                table = {};
                row[tableAlias] = table;
            }
            table[columnAlias] = value;
        }
        if (hasNullableJoins) {
            for (const tableAlias of Object.keys(row)) {
                if (
                    query.fromClause.currentJoins != undefined &&
                    query.fromClause.currentJoins.findIndex(
                        j => j.tableAlias == tableAlias
                    ) < 0
                ) {
                    //Probably `__aliased`
                    continue;
                }
                const map = row[tableAlias];
                if (map == undefined) {
                    continue;
                }
                const allNull = Object.keys(map)
                    .every(columnAlias => map[columnAlias] === null);
                if (allNull) {
                    row[tableAlias] = undefined;
                }
            }
        }
        rows.push(row);
    }
    return {
        sql : rawResult.query.sql,
        resultSet : rows as UnmappedResultSet<QueryT>,
    };
}
