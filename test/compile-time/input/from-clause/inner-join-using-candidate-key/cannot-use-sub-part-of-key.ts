import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
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
    myTable,
    c => [c.userId]
);

export const fromClause2 = tsql.FromClauseUtil.innerJoinUsingCandidateKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        childTable
    ),
    tables => tables.childTable,
    myTable,
    c => [c.computerId]
);
