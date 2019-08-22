import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    });

const notInJoins = tsql.table("notInJoins")
    .addColumns({
        column : tm.mysql.bigIntSigned(),
    });

tsql.FromClauseUtil.innerJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable,
    columns => tsql.eq(
        notInJoins.columns.column,
        columns.otherTable.otherTableId
    )
);
