import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        userId : tm.literal(1n).orNull(),
        computerId : tm.mysql.varChar().orNull(),
        createdAt : tm.mysql.dateTime(),
    })
    .addCandidateKey(c => [c.userId, c.computerId]);

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned().orNull(),
        computerId : tm.literal("hello").orNull(),
        accessedAt : tm.mysql.dateTime(),
    });

const eqCandidateKeyOfTable = tsql.makeEqCandidateKeyOfTable(
    tsql.makeNullSafeComparison("<=>")
);
export const fromClause = tsql.FromClauseUtil.innerJoinUsingCandidateKey(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        childTable
    ),
    eqCandidateKeyOfTable,
    tables => tables.childTable,
    myTable,
    c => [c.userId, c.computerId]
);
