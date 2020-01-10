import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const myTable = tsql.table("myTable")
        .addColumns({
            myBoolColumn : tm.mysql.boolean(),
        });

    const query = tsql.from(myTable)
        .select(c => [c.myBoolColumn, tsql.double.pi().as("pi")])
        .orderBy(c => [
            c.myTable.myBoolColumn,
            c.myTable.myBoolColumn.asc(),
            c.myTable.myBoolColumn.desc(),
            tsql.isNotNull(c.myTable.myBoolColumn),
            tsql.isNotNull(c.myTable.myBoolColumn).asc(),
            tsql.isNotNull(c.myTable.myBoolColumn).desc(),
            tsql.isNotNull(c.myTable.myBoolColumn).as("someName"),
            tsql.isNotNull(c.myTable.myBoolColumn).as("someName").asc(),
            tsql.isNotNull(c.myTable.myBoolColumn).as("someName").desc(),

            c.$aliased.pi,
            c.$aliased.pi.asc(),
            c.$aliased.pi.desc(),
            tsql.isNotNull(c.$aliased.pi),
            tsql.isNotNull(c.$aliased.pi).asc(),
            tsql.isNotNull(c.$aliased.pi).desc(),
            tsql.isNotNull(c.$aliased.pi).as("someName"),
            tsql.isNotNull(c.$aliased.pi).as("someName").asc(),
            tsql.isNotNull(c.$aliased.pi).as("someName").desc()
        ]);

    compareSqlPretty(__filename, t, query);

    t.end();
});
