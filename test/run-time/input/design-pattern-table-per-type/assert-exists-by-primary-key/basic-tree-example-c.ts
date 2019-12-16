import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {createCTableSql, cTpt} from "../tree-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(createCTableSql);

        await cTpt.insertAndFetch(
            connection,
            {
                b1Name: 'b1',
                b2Name: 'b2',
                a1Name: 'a1',
                a2Name: 'a2',
                a3Name: 'a3',
                a4Name: 'a4',
                createdAt: new Date(0),
            }
        ).then((result) => {
            t.deepEqual(
                result,
                {
                    a1Id: BigInt(1),
                    a2Id: BigInt(1),
                    a3Id: BigInt(1),
                    a4Id: BigInt(1),
                    b1Id: BigInt(1),
                    b1Name: 'b1',
                    b2Name: 'b2',
                    a1Name: 'a1',
                    a2Name: 'a2',
                    a3Name: 'a3',
                    a4Name: 'a4',
                    createdAt: new Date(0),
                }
            );
        });

        await cTpt.fetchOne(
            connection,
            (columns) => tsql.and(
                tsql.eq(
                    columns.c.b1Id,
                    BigInt(1)
                ),
                tsql.eq(
                    columns.c.a3Id,
                    BigInt(1)
                )
            )
        ).then((fetchOneResult) => {
            t.deepEqual(
                fetchOneResult,
                {
                    a1Id: BigInt(1),
                    a2Id: BigInt(1),
                    a3Id: BigInt(1),
                    a4Id: BigInt(1),
                    b1Id: BigInt(1),
                    b1Name: 'b1',
                    b2Name: 'b2',
                    a1Name: 'a1',
                    a2Name: 'a2',
                    a3Name: 'a3',
                    a4Name: 'a4',
                    createdAt: new Date(0),
                }
            );
        });

        await cTpt.assertExistsByPrimaryKey(
            connection,
            {
                b1Id : BigInt(1),
                a3Id : BigInt(1),
            }
        ).then(() => {
            t.pass("");
        }).catch((err) => {
            t.fail(err.message);
        });
    });

    t.end();
});
