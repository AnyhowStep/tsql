import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    });

const outerTable = tsql.table("outerTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        outerColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.outerTableIdA, c.outerTableIdB]);

export const query = tsql.QueryUtil.newInstance()
    .requireOuterQueryJoins(myTable, otherTable)
    .from(outerTable)
    .whereEqInnerQueryPrimaryKey(
        tables => Math.random() > 0.5 ? tables.myTable : tables.otherTable,
        outer => outer.outerTable
    );
