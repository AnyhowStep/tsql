import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {dtPoint} from "../../dt-point";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : dtPoint,
        testVal : dtPoint,
    });

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE myTable (
                myTableId TEXT PRIMARY KEY,
                testVal TEXT
            );
            INSERT INTO
                myTable(myTableId, testVal)
            VALUES
                ('{"x":1,"y":2}', '{"x":100,"y":200}'),
                ('{"x":2,"y":2}', '{"x":200,"y":200}'),
                ('{"x":3,"y":2}', '{"x":300,"y":200}');
        `);
        return tsql.from(myTable)
            .whereEq(
                columns => columns.myTableId,
                {
                    x : 1,
                    y : 2,
                }
            )
            .select(columns => [columns])
            .fetchOne(connection);
    });
    t.deepEqual(
        resultSet,
        {
            myTableId : {
                x : 1,
                y : 2,
            },
            testVal : {
                x : 100,
                y : 200,
            },
        }
    );

    await pool.disconnect();
    t.end();
});
