import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";

declare const eqCandidateKeyOfTable : tsql.EqCandidateKeyOfTable;
const myTable = tsql.table("myTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
        outerColumn : tm.mysql.varChar(),
    });

const outerTable = tsql.table("outerTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        outerColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.outerTableIdA, c.outerTableIdB])
    .addCandidateKey(c => [c.outerColumn, c.outerTableIdA]);

export const expr = eqCandidateKeyOfTable(
    myTable,
    outerTable,
    //Should be OK
    c => (
        Math.random() > 0.5 ?
        [c.outerTableIdA, c.outerTableIdB] :
        [c.outerTableIdB, c.outerTableIdA]
    )
);
