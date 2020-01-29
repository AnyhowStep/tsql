import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tsql.dtBigIntSigned(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .where(columns => tsql.gt(
        columns.myColumn,
        tsql.countAll()
    ));
