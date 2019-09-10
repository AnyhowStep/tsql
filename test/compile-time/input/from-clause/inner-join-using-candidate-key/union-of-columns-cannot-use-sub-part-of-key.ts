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
        createdAt : tm.mysql.dateTime(),
        accessedAt : tm.mysql.dateTime(),
    });

tsql.FromClauseUtil.innerJoinUsingCandidateKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        childTable
    ),
    tables => tables.childTable,
    myTable,
    c => (
        Math.random() > 0.5 ?
        [c.userId, c.computerId] :
        [c.userId]
    )
);

tsql.FromClauseUtil.innerJoinUsingCandidateKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        childTable
    ),
    tables => tables.childTable,
    myTable,
    c => (
        Math.random() > 0.5 ?
        [c.computerId] :
        [c.userId, c.computerId]
    )
);

tsql.FromClauseUtil.innerJoinUsingCandidateKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        childTable
    ),
    tables => tables.childTable,
    myTable,
    c => (
        Math.random() > 0.5 ?
        [c.computerId] :
        [c.userId]
    )
);
