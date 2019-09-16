import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        myOtherTableId : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .leftJoin(myOtherTable, columns => tsql.isNotNull(
        columns.myTable.myTableId
    ))
    .select(c => [c])
    .map(async (row) => {
        return {
            ...row,
            x : row.myTable.myTableId + (
                row.myOtherTable == undefined ?
                0n :
                row.myOtherTable.myOtherTableId
            ),
        };
    })
    .map(async (row) => {
        return {
            x2 : row,
            x3 : row.x,
        };
    });
