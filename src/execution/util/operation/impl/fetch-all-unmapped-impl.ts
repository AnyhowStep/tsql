import {ColumnRefUtil, ColumnRef} from "../../../../column-ref";
import {SEPARATOR} from "../../../../constants";
import {QueryBaseUtil} from "../../../../query-base";
import {UnmappedResultSet, RawRow} from "../../helper-type";
import {SelectConnection} from "../../../connection";

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
            const separatorIndex = k.indexOf(SEPARATOR);
            const tableAlias = k.substr(0, separatorIndex);
            const columnAlias = k.substr(separatorIndex+SEPARATOR.length);

            try {
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
            } catch (err) {
                Object.defineProperty(err, "sql", {
                    value : rawResult.query.sql,
                    enumerable : false,
                    writable : true,
                });
                throw err;
            }
        }
        if (hasNullableJoins) {
            for (const tableAlias of Object.keys(row)) {
                if (
                    query.fromClause.currentJoins != undefined &&
                    query.fromClause.currentJoins.findIndex(
                        j => j.tableAlias == tableAlias
                    ) < 0
                ) {
                    //Probably `$aliased`
                    continue;
                }
                if (query.fromClause.currentJoins != undefined) {
                    const join = query.fromClause.currentJoins.find(
                        j => j.tableAlias == tableAlias
                    );
                    if (join != undefined && !join.nullable) {
                        //This is not a nullable join, do not make it `undefined`,
                        //no matter what.
                        continue;
                    }
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
