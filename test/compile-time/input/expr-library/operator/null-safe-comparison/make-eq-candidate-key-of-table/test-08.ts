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

const outerTable2 = tsql.table("outerTable2")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        outerColumn : tm.mysql.varChar(),
    })
    .addCandidateKey(c => [c.outerColumn, c.outerTableIdA]);

export const expr = eqCandidateKeyOfTable(
    myTable,
    (Math.random() > 0.5 ? outerTable : outerTable2),
    //Should be OK
    c => [c.outerColumn, c.outerTableIdA]
);
