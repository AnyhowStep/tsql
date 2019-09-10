import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        createdAt : tm.mysql.dateTime(),
    })
    .addCandidateKey(c => [c.userId, c.computerId]);

const myTable2 = tsql.table("myTable2")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        createdAt : tm.mysql.dateTime(),
    })
    .addCandidateKey(c => [c.userId, c.computerId]);

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        accessedAt : tm.mysql.dateTime(),
    });

export const fromClause = tsql.FromClauseUtil.innerJoinUsingCandidateKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        childTable
    ),
    tables => tables.childTable,
    Math.random() > 0.5 ? myTable : myTable2,
    c => [c.userId, c.computerId]
);
