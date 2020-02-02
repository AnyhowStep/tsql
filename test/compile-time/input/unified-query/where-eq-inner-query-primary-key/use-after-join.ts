import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
        outerTable2IdA : tm.mysql.bigIntUnsigned(),
        outerTable2IdB : tm.mysql.boolean(),
    });

const otherTable2 = tsql.table("otherTable2")
    .addColumns({
        outerTable2IdA : tm.mysql.bigIntUnsigned(),
        outerTable2IdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    });

const outerTable = tsql.table("outerTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        outerTableIdB : tm.mysql.boolean(),
        outerColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.outerTableIdA, c.outerTableIdB]);

const outerTable2 = tsql.table("outerTable2")
    .addColumns({
        outerTable2IdA : tm.mysql.bigIntUnsigned(),
        outerTable2IdB : tm.mysql.boolean(),
        outerColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.outerTable2IdA, c.outerTable2IdB]);

/**
 * This is a correlated subquery, referencing `outerTable` from an outer query,
 * ```sql
 *  --snip
 *  FROM
 *      myTable
 *  WHERE
 *      myTable.outerTableIdA <=> outerTable.outerTableIdA AND
 *      myTable.outerTableIdB <=> outerTable.outerTableIdB
 * ```
 */
export const query = tsql.QueryUtil.newInstance()
    .requireOuterQueryJoins(myTable, otherTable, otherTable2)
    .from(outerTable)
    .crossJoin(outerTable2)
    .whereEqInnerQueryPrimaryKey(
        tables => tables.myTable,
        outer => outer.outerTable
    )
    .whereEqInnerQueryPrimaryKey(
        tables => tables.otherTable,
        outer => outer.outerTable
    )
    .whereEqInnerQueryPrimaryKey(
        tables => tables.otherTable,
        outer => outer.outerTable2
    )
    .whereEqInnerQueryPrimaryKey(
        tables => tables.otherTable2,
        outer => outer.outerTable2
    );
