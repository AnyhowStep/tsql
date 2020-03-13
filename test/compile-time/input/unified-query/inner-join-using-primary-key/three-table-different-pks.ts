import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const table0 = tsql.table("table0")
    .addColumns({
        table0Id : tm.mysql.bigIntUnsigned(),
        table1Id : tm.mysql.bigIntUnsigned(),
    });

const table1 = tsql.table("table1")
    .addColumns({
        table1Id : tm.mysql.bigIntUnsigned(),
        table2Id : tm.mysql.bigIntUnsigned(),
    })
    .setPrimaryKey(columns => [columns.table1Id]);

const table2 = tsql.table("table2")
    .addColumns({
        table2Id : tm.mysql.bigIntUnsigned(),
        table3Id : tm.mysql.bigIntUnsigned(),
    })
    .setPrimaryKey(columns => [columns.table2Id]);

export const query = tsql
    .from(table0)
    .innerJoinUsingPrimaryKey(
        tables => tables.table0,
        table1
    )
    .innerJoinUsingPrimaryKey(
        tables => tables.table1,
        table2
    );
