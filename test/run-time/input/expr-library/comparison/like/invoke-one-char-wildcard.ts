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
                myColumn VARCHAR PRIMARY KEY
            );
            INSERT INTO
                myTable(myColumn)
            VALUES
                ('Alice'),
                ('Bob'),
                ('Charlie'),
                ('kebob');
        `);
        const myTable = tsql.table("myTable")
            .addColumns({
                myColumn : tm.mysql.varChar(),
            });
        await tsql
            .from(myTable)
            .selectValue(columns => columns.myColumn)
            .where(columns => tsql.like(
                columns.myColumn,
                "%b_b%",
                "'"
            ))
            .orderBy(columns => [
                columns.myColumn.asc(),
            ])
            .fetchValueArray(connection)
            .then((arr) => {
                t.deepEqual(arr, ["Bob", "kebob"]);
            });
    });

    await pool.disconnect();
    t.end();
});
