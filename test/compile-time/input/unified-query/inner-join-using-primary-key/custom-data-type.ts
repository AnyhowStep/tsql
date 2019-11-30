import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
        myOtherTableId : () => {
            return {
                x : 1,
                y : 2,
            };
        },
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        myOtherTableId : () => {
            return {
                x : 1,
                y : 2,
            };
        },
    })
    .setPrimaryKey(columns => [columns.myOtherTableId]);

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .innerJoinUsingPrimaryKey(
        tables => tables.myTable,
        myOtherTable
    );
