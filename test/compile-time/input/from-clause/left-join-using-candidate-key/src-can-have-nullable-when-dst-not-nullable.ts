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
        userId : tm.mysql.bigIntSigned().orNull(),
        computerId : tm.mysql.varChar().orNull(),
        accessedAt : tm.mysql.dateTime(),
    });

export const fromClause = tsql.FromClauseUtil.leftJoinUsingCandidateKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        childTable
    ),
    tables => tables.childTable,
    myTable,
    c => [c.userId, c.computerId]
);
