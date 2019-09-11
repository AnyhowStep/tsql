import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableIdA : tm.mysql.bigIntUnsigned(),
        myTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
        nullableColumn : tm.mysql.double().orNull(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    )
    .whereEqColumns(
        tables => tables.myTable,
        //Should work for nullable columns and values, too
        {
            nullableColumn : null,
        }
    );
