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
    columns => (
        /**
         * The two `SelectsT` have different `usedRef` but the first
         * is a subset of the second.
         */
        Math.random() > 0.5 ?
        [
            tsql.eq(columns.myTable.myTableId, columns.myTable.myTableId).as("eq")
        ] :
        [
            tsql.eq(columns.myTable.myTableId, columns.otherTable.otherTableId).as("eq")
        ]
    )
)
