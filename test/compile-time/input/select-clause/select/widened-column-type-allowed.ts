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

const otherTableWithWidenedType = tsql.table("otherTable")
    .addColumns({
        /**
         * No idea why you would want to do this...
         * But it's technically sound,
         * assuming the original table is not lying about the column type.
         */
        otherTableId : tm.mysql.bigIntSigned().orNull().or(tm.mysql.boolean()),
    });

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
    () => [
        otherTableWithWidenedType.columns.otherTableId,
    ]
)
