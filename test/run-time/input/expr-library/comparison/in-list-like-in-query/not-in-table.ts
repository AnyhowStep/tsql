import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE myTable (
                myColumn INT PRIMARY KEY
            );
            INSERT INTO
                myTable(myColumn)
            VALUES
                (4);
        `);
        const myTable = tsql.table("myTable")
            .addColumns({
                myColumn : tm.mysql.double(),
            });
        await tsql
            .selectValue(() => tsql.inArray(
                3,
                [
                    tsql.from(myTable)
                        .selectValue(columns => columns.myColumn)
                        .limit(1)
                        .coalesce(0)
                ]
            ))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, false);
            });
        await tsql
            .selectValue(() => tsql.inArray(
                3,
                [
                    tsql.from(myTable)
                        .selectValue(columns => columns.myColumn)
                        .limit(1)
                        .coalesce(3)
                ]
            ))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, false);
            });
        await tsql
            .selectValue(() => tsql.inArray(
                3,
                [
                    tsql.from(myTable)
                        .selectValue(columns => columns.myColumn)
                        .limit(0)
                        .coalesce(3)
                ]
            ))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, true);
            });
    });

    await pool.disconnect();
    t.end();
});
