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

const otherTable2 = tsql.table("otherTable2")
    .addColumns({
        otherTable2Id : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    });

export const fromClause = tsql.FromClauseUtil.innerJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    Math.random() > 0.5 ? otherTable : otherTable2,
    () => true
);
