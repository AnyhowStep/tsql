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

const myTable2 = tsql.table("myTable2")
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
    (Math.random() > 0.5 ? myTable : myTable2),
    outerTable,
    //Should be OK
    c => [c.outerTableIdA, c.outerTableIdB]
);
