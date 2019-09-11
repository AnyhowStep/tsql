import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
        outerTable2IdA : tm.mysql.bigIntUnsigned(),
        outerTable2IdB : tm.mysql.boolean(),
    });

const outerTable = tsql.table("outerTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        outerColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.outerTableIdA, c.outerTableIdB]);

const outerTable2 = tsql.table("outerTable2")
    .addColumns({
        outerTable2IdA : tm.mysql.bigIntUnsigned(),
        outerTable2IdB : tm.mysql.boolean(),
        outerColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.outerTable2IdA, c.outerTable2IdB]);

export const query = tsql.QueryUtil.newInstance()
    .requireOuterQueryJoins(outerTable, outerTable2)
    .from(myTable)
    .whereEqOuterQueryPrimaryKey(
        tables => tables.myTable,
        outer => Math.random() > 0.5 ? outer.outerTable : outer.outerTable2
    );
