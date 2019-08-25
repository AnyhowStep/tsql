import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
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
        //This table will not be in the joins
        outerQueryTable : {
            outerQueryTableId : bigint,
        }
    }>;
}>;

export const fromClause = tsql.FromClauseUtil.leftJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable,
    () => true
);
