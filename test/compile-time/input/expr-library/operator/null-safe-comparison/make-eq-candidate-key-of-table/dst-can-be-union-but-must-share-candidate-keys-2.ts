import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        createdAt : tm.mysql.dateTime(),
    })
    .addCandidateKey(c => [c.userId, c.computerId])
    .addCandidateKey(c => [c.userId, c.createdAt]);

const myTable2 = tsql.table("myTable2")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        createdAt : tm.mysql.dateTime(),
    })
    .addCandidateKey(c => [c.userId, c.computerId])
    .addCandidateKey(c => [c.createdAt, c.computerId]);

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        accessedAt : tm.mysql.dateTime(),
    });

export const eqCandidateKeyOfTable = tsql.makeEqCandidateKeyOfTable(
    tsql.makeNullSafeComparison("<=>")
);
export const expr = eqCandidateKeyOfTable(
    childTable,
    Math.random() > 0.5 ? myTable : myTable2,
    c => [c.userId, c.computerId]
);

export const expr2 = eqCandidateKeyOfTable(
    childTable,
    Math.random() > 0.5 ? myTable : myTable2,
    c => [c.userId, c.createdAt]
);

export const expr3 = eqCandidateKeyOfTable(
    childTable,
    Math.random() > 0.5 ? myTable : myTable2,
    c => [c.createdAt, c.computerId]
);
