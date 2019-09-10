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
    .addCandidateKey(c => [c.userId, c.createdAt]);

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        accessedAt : tm.mysql.dateTime(),
        createdAt : tm.mysql.dateTime(),
    });

const eqCandidateKeyOfTable = tsql.eqCandidateKeyOfTable;



const fromClause = tsql.FromClauseUtil.from(
    tsql.FromClauseUtil.requireOuterQueryJoins(
        tsql.FromClauseUtil.newInstance(),
        myTable,
        myTable2
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

export const result2 = tsql.FromClauseUtil.whereEqOuterQueryCandidateKey(
    result.fromClause,
    undefined,
    eqCandidateKeyOfTable,
    tables => tables.childTable,
    tables => tables.myTable2,
    columns => [columns.userId, columns.createdAt]
);
