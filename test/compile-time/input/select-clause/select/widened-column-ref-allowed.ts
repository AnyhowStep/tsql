import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned().orNull(),
    });

const myTableWithWidenedType = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        /**
         * No idea why you would want to do this...
         * But it's technically sound,
         * assuming the original table is not lying about the column type.
         */
        createdAt : tm.mysql.dateTime().orNull(),
    })

const fromClause = tsql.FromClauseUtil.crossJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable
);

export const selectClause = tsql.SelectClauseUtil.select(
    fromClause,
    undefined,
    columns => [
        {
            otherTable : columns.otherTable,
            myTable : myTableWithWidenedType.columns,
        }
    ]
)
