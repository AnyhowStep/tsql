import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId DOUBLE PRIMARY KEY,
                testVal DOUBLE
            );
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.double(),
                testVal : tm.mysql.double(),
            });

        return tsql.selectValue(() => 42 as number)
            .unionDistinct(
                tsql.from(test)
                    .select(columns => [columns.testVal])
            )
            .compoundQueryOrderBy(columns => [
                columns.value.desc(),
            ])
            .compoundQueryLimit(1)
            .fetchOneOr(
                connection,
                "Hello, world"
            );
    });
    t.deepEqual(
        resultSet,
        {
            value : 42,
        }
    );

    t.end();
});
