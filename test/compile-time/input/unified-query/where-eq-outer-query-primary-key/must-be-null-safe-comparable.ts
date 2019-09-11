import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        /**
         * BOOLEAN
         */
        outerTableIdB : tm.mysql.boolean(),
        otherColumn : tm.mysql.varChar(),
    });

const outerTable = tsql.table("outerTable")
    .addColumns({
        outerTableIdA : tm.mysql.bigIntUnsigned(),
        /**
         * DATETIME
         */
        outerTableIdB : tm.mysql.dateTime(),
        outerColumn : tm.mysql.varChar(),
    })
    .setPrimaryKey(c => [c.outerTableIdA, c.outerTableIdB]);

export const query = tsql.QueryUtil.newInstance()
    .requireOuterQueryJoins(outerTable)
    .from(myTable)
    .whereEqOuterQueryPrimaryKey(
        tables => tables.myTable,
        /**
         * Cannot compare because data types are not **null-safe** comparable
         */
        outer => outer.outerTable
    );
