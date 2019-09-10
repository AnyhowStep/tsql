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

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        createdAt : tm.mysql.dateTime(),
        accessedAt : tm.mysql.dateTime(),
    });

export const eqCandidateKeyOfTable = tsql.eqCandidateKeyOfTable;
export const expr = eqCandidateKeyOfTable(
    childTable,
    myTable,
    c => (
        Math.random() > 0.5 ?
        [c.userId, c.computerId] :
        [c.userId, c.createdAt]
    )
);
