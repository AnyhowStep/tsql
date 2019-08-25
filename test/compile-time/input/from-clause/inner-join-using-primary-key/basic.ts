import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })
    .setPrimaryKey(columns => [columns.otherTableId]);

export const eqPrimaryKeyOfTable = tsql.makeEqPrimaryKeyOfTable(
    tsql.makeNullSafeComparison("<=>")
);
export const fromClause = tsql.FromClauseUtil.innerJoinUsingPrimaryKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    eqPrimaryKeyOfTable,
    tables => tables.myTable,
    otherTable
);
