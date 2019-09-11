import * as tape from "tape";
import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {compareSqlPretty} from "../../../compare-sql-pretty";

tape(__filename, t => {
    const tableA = tsql.table("tableA")
        .addColumns({
            b : tm.mysql.boolean(),
            z : tm.mysql.boolean(),
            a : tm.mysql.boolean(),
            x : tm.mysql.boolean(),
            c : tm.mysql.boolean(),
            y : tm.mysql.boolean(),
        });
    const tableB = tsql.table("tableB")
        .addColumns({
            b : tm.mysql.boolean(),
            z : tm.mysql.boolean(),
            a : tm.mysql.boolean(),
            x : tm.mysql.boolean(),
            c : tm.mysql.boolean(),
            y : tm.mysql.boolean(),
        });
    const tableC = tsql.table("tableC")
        .addColumns({
            b : tm.mysql.boolean(),
            z : tm.mysql.boolean(),
            a : tm.mysql.boolean(),
            x : tm.mysql.boolean(),
            c : tm.mysql.boolean(),
            y : tm.mysql.boolean(),
        });

    const query = tsql.from(tableC)
        .crossJoin(tableA)
        .crossJoin(tableB)
        .select(c => [c]);

    compareSqlPretty(__filename, t, query);

    t.end();
});
