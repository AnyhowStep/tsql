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

const eqCandidateKeyOfTable = tsql.makeEqCandidateKeyOfTable(
    tsql.makeNullSafeComparison("<=>")
);

const fromClause = tsql.FromClauseUtil.from(
    tsql.FromClauseUtil.requireOuterQueryJoins(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    childTable
);

export const result = tsql.FromClauseUtil.whereEqOuterQueryCandidateKey(
    fromClause,
    undefined,
    eqCandidateKeyOfTable,
    tables => tables.childTable,
    tables => tables.myTable,
    columns => [columns.userId, columns.computerId]
);
