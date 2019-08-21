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

tsql.FromClauseUtil.innerJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable,
    columns => {
        return tsql.eq(
            columns.myTable.myTableId,
            columns.otherTable.otherTableId
        );
    }
);
tsql.FromClauseUtil.innerJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable,
    columns => {
        //Temporary variable to avoid max depth error.
        //Wtf?
        const tmp = tsql.eq(
            columns.myTable.myTableId,
            columns.otherTable.otherTableId
        );
        return tmp;
    }
);
