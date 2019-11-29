import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        myColumn : tm.mysql.bigIntSigned(),
        myColumn2 : tm.mysql.bigIntSigned(),
        stringColumn : tm.mysql.varChar(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        otherColumn : tm.mysql.bigIntSigned(),
    });

export const myQuery = tsql
    .from(myTable)
    .select((columns, subquery) => [
        /**
         * With only one table in the `FROM` clause,
         * we do not need to qualify columns with a table name.
         *
         * This refers to `myTable.myColumn`
         */
        columns.myColumn,
        columns.myColumn2.as("aliasedColumnExpression"),
        tsql.ExprUtil.fromBuiltInExpr("I am an aliased expression").as("aliasedLiteralValueExpression"),
        tsql.concat(
            "I am another aliased expression",
            /**
             * With only one table in the `FROM` clause,
             * we do not need to qualify columns with a table name.
             *
             * This refers to `myTable.stringColumn`
             */
            columns.stringColumn
        ).as("aliasedExpression"),
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            .as("aliasedSubqueryExpression")
    ]);
export const fetchedRow = myQuery.fetchOne(null as any);
