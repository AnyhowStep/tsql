import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire((connection) => {
        return tsql.selectValue(() => 42 as number)
            .unionDistinct(
                tsql.selectValue(() => 99)
            )
            .compoundQueryOrderBy(columns => [
                columns.value.desc(),
            ])
            .fetchValueOr(
                connection,
                "Hello, world"
            );
    }).then(() => {
        t.fail("Expected to fail");
    }).catch((err) => {
        t.true(err instanceof tsql.TooManyRowsFoundError);
        t.deepEqual(err.name, "TooManyRowsFoundError");
        t.deepEqual(err.sql, `SELECT 42e0 AS "$aliased--value" UNION SELECT 99e0 AS "$aliased--value" ORDER BY "$aliased--value" DESC LIMIT 2 OFFSET 0`);
    });

    await pool.disconnect();
    t.end();
});

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire((connection) => {
        return tsql.selectValue(() => 42 as number)
            .unionDistinct(
                tsql.selectValue(() => 99)
            )
            .compoundQueryOrderBy(columns => [
                columns.value.desc(),
            ])
            .fetchValue(connection)
            .or("Hello, world");
    }).then(() => {
        t.fail("Expected to fail");
    }).catch((err) => {
        t.true(err instanceof tsql.TooManyRowsFoundError);
        t.deepEqual(err.name, "TooManyRowsFoundError");
        t.deepEqual(err.sql, `SELECT 42e0 AS "$aliased--value" UNION SELECT 99e0 AS "$aliased--value" ORDER BY "$aliased--value" DESC LIMIT 2 OFFSET 0`);
    });

    await pool.disconnect();
    t.end();
});
