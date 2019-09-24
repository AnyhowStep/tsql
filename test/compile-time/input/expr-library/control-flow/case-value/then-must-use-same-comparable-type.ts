import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        someColumn00 : tm.mysql.double(),
        someColumn01 : tm.literal(1),
        someColumn02 : tm.mysql.double(),
        someColumn03 : tm.mysql.varChar(),
    });

tsql.caseValue(myTable.columns.someColumn00)
    .when(myTable.columns.someColumn01, myTable.columns.someColumn02)
    .when(myTable.columns.someColumn01, myTable.columns.someColumn03);
