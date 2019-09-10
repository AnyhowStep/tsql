import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned(),
        computerId : tm.mysql.varChar(),
        createdAt : tm.mysql.dateTime(),
    })
    .setPrimaryKey(c => [c.userId, c.computerId]);

const childTable = tsql.table("childTable")
    .addColumns({
        userId : tm.mysql.bigIntSigned().orNull(),
        accessedAt : tm.mysql.dateTime(),
    });

const eqPrimaryKeyOfTable = tsql.eqPrimaryKeyOfTable;


export const expr = eqPrimaryKeyOfTable(
    childTable,
    myTable
);
