import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";

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
export const expr = eqCandidateKeyOfTable(
    childTable,
    myTable,
    c => [c.userId]
);
export const expr2 = eqCandidateKeyOfTable(
    childTable,
    myTable,
    c => [c.computerId]
);
