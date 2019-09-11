import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableIdA : tm.mysql.bigIntUnsigned(),
        myTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEqPrimaryKey(
        //(parameter) tables: {}
        tables => tables.myTable,
        {}
    );
