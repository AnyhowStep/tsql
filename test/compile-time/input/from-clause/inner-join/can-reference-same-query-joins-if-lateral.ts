import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
    })

const myTable2 = tsql.table("myTable2")
    .addColumns({
        myTable2Id : tm.mysql.bigIntSigned(),
    })

declare const otherTable : tsql.AliasedTable<{
    isLateral : true;
    alias : "otherTable";
    columns : {
        otherTableId : tsql.IColumn<{
            tableAlias : "otherTable",
            columnAlias : "otherTableId",
            mapper : tm.SafeMapper<bigint>,
        }>
    };
    usedRef : tsql.IUsedRef<{
        myTable2 : {
            myTable2Id : bigint,
        }
    }>;
}>;

export const fromClause = tsql.FromClauseUtil.innerJoin(
    tsql.FromClauseUtil.crossJoin(
        tsql.FromClauseUtil.from(
            tsql.FromClauseUtil.newInstance(),
            myTable
        ),
        myTable2
    ),
    otherTable,
    () => true
);
