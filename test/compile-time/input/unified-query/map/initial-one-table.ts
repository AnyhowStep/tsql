import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
        myTableId2 : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .select(c => [c.myTableId])
    .map((row) => {
        return {
            ...row,
            x : row.myTable.myTableId + row.myTable.myTableId,
        };
    })
    .select(c => [c.myTableId2])
    .map((row, _connection, originalRow) => {
        return {
            ...row,
            y : originalRow.myTable.myTableId2 + originalRow.myTable.myTableId2,
        };
    });
