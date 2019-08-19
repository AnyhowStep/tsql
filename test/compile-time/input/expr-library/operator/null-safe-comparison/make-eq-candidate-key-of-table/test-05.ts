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

const myTable3 = tsql.table("myTable3")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.varChar(), //varChar, not boolean
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
    (Math.random() > 0.5 ? myTable : myTable3),
    outerTable,
    //Should be Error
    c => [c.outerTableIdA, c.outerTableIdB]
);
