import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        someColumn00 : tm.mysql.double(),
        someColumn01 : tm.literal(1),
        someColumn02 : tm.mysql.double(),
        someColumn03 : tm.mysql.double().orNull(),
        someColumn04 : tm.literal(1),
    });

export const expr = tsql.caseValue(myTable.columns.someColumn00)
    .when(myTable.columns.someColumn01, myTable.columns.someColumn02)
    .when(myTable.columns.someColumn01, myTable.columns.someColumn03)
    .when(myTable.columns.someColumn01, null)
    .when(myTable.columns.someColumn01, myTable.columns.someColumn04);
