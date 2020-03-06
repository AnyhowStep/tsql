import * as tm from "type-mapping";
import * as tape from "tape";
import {Pool} from "./promise.sql";
import {SqliteWorker} from "./worker.sql";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    const [
        createTableResult,
        insertResult,
        insertResult2,
        insertResult3,
        createFunctionResult,
        selectResults,
    ] = await pool.acquire((connection) => {
        return Promise.all([
            connection.exec("CREATE TABLE testTable (a INT, b INT)"),
            connection.exec("INSERT INTO testTable (a, b) VALUES (1337, 9001)"),
            connection.exec(`
                INSERT INTO testTable (a, b) VALUES (1337, 9001);
                INSERT INTO testTable (a, b) VALUES (42, 24);
            `),
            connection.exec(`
                INSERT INTO testTable (a, b) VALUES (1337, 9001), (42, 24);
            `),
            connection.createAggregate(
                "customAggregate",
                () => {
                    return {
                        sum : BigInt(0),
                    };
                },
                (state, a, b) => {
                    if (tm.TypeUtil.isBigInt(a) && tm.TypeUtil.isBigInt(b)) {
                        state.sum = tm.BigIntUtil.add(
                            state.sum,
                            tm.BigIntUtil.add(a, b)
                        );
                    } else {
                        throw new Error(`Arguments must be integer`);
                    }
                },
                (state) => state == undefined ? BigInt(0) : state.sum
            ),
            connection.exec("SELECT customAggregate(a, b) FROM testTable ORDER BY a DESC"),
        ]);
    });
    t.deepEqual(createTableResult, {
        execResult : [],
        rowsModified : 0,
    });

    t.deepEqual(insertResult, {
        execResult : [],
        rowsModified : 1,
    });

    t.deepEqual(insertResult2, {
        execResult : [],
        rowsModified : 1,
    });

    t.deepEqual(insertResult3, {
        execResult : [],
        rowsModified : 2,
    });

    t.deepEqual(createFunctionResult, undefined);

    t.deepEqual(
        selectResults,
        {
            execResult : [
                {
                    columns: [ 'customAggregate(a, b)' ],
                    values: [
                        [ BigInt(31146) ]
                    ],
                }
            ],
            /**
             * `SELECT` statement does not change value of `rowsModified`
             */
            rowsModified : 2,
        }
    );

    await pool.disconnect();
    t.end();
});
