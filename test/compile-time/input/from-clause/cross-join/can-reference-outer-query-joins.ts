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
 * You can reference outer query joins in MySQL 8.
 * You cannot do so in MySQL 5.7.
 *
 * The SQL standard allows it.
 */
export const fromClause = tsql.FromClauseUtil.crossJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.requireOuterQueryJoins(
            tsql.FromClauseUtil.newInstance(),
            outerQueryTable
        ),
        myTable
    ),
    otherTable
);
