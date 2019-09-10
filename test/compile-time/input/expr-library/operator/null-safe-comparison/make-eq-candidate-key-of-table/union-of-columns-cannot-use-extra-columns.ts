import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        createdAt : tm.mysql.dateTime(),
        accessedAt : tm.mysql.dateTime(),
    })
    .addCandidateKey(c => [c.userId, c.computerId])
    .addCandidateKey(c => [c.userId, c.createdAt])
    .addCandidateKey(c => [c.createdAt, c.accessedAt]);

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        createdAt : tm.mysql.dateTime(),
        accessedAt : tm.mysql.dateTime(),
    });

const eqCandidateKeyOfTable = tsql.eqCandidateKeyOfTable;
eqCandidateKeyOfTable(
    childTable,
    myTable,
    c => (
        Math.random() > 0.5 ?
        [c.userId, c.computerId] :
        [c.userId, c.computerId, c.createdAt]
    )
);

eqCandidateKeyOfTable(
    childTable,
    myTable,
    c => (
        Math.random() > 0.5 ?
        [c.userId, c.computerId, c.createdAt] :
        [c.userId, c.computerId]
    )
);

eqCandidateKeyOfTable(
    childTable,
    myTable,
    c => (
        Math.random() > 0.5 ?
        [c.userId, c.computerId, c.createdAt] :
        [c.userId, c.computerId, c.accessedAt]
    )
);
