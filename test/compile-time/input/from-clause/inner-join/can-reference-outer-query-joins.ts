import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
    })

const outerQueryTable = tsql.table("outerQueryTable")
    .addColumns({
        outerQueryTableId : tm.mysql.bigIntSigned(),
    })

declare const otherTable : tsql.AliasedTable<{
    isLateral : false;
    alias : "otherTable";
    columns : {
        otherTableId : tsql.IColumn<{
            tableAlias : "otherTable",
            columnAlias : "otherTableId",
            mapper : tm.SafeMapper<bigint>,
        }>
    };
    usedRef : tsql.IUsedRef<{
        outerQueryTable : {
            outerQueryTableId : bigint,
        }
    }>;
}>;

/**
 * You cannot reference outer query joins in MySQL 8.
 * You cannot reference outer query joins in MySQL 5.7.
 * You can reference outer query joins in PostgreSQL 9.4.
 * You can reference outer query joins in SQLite 3.26.
 *
 * The SQL standard allows it. MySQL just doesn't.
 */
export const fromClause = tsql.FromClauseUtil.innerJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.requireOuterQueryJoins(
            tsql.FromClauseUtil.newInstance(),
            outerQueryTable
        ),
        myTable
    ),
    otherTable,
    columns => tsql.notEq(
        columns.outerQueryTable.outerQueryTableId,
        columns.myTable.myTableId
    )
);
