import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        createdAt : tm.mysql.dateTime(),
    })
    .setPrimaryKey(c => [c.userId, c.computerId]);

const myTable2 = tsql.table("myTable2")
    .addColumns({
        userId2 : tm.mysql.bigIntSigned(),
        computerId2 : tm.mysql.varChar(),
        createdAt2 : tm.mysql.dateTime(),
    })
    .setPrimaryKey(c => [c.userId2, c.computerId2]);

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        userId2 : tm.mysql.bigIntSigned(),
        computerId2 : tm.mysql.varChar(),
        accessedAt : tm.mysql.dateTime(),
    });

const eqPrimaryKeyOfTable = tsql.eqPrimaryKeyOfTable;


export const fromClause = tsql.FromClauseUtil.leftJoinUsingPrimaryKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        childTable
    ),
    eqPrimaryKeyOfTable,
    tables => tables.childTable,
    Math.random() > 0.5 ? myTable : myTable2
);
