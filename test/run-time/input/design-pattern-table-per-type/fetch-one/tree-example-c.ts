import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {createCTableSql, a1, a2, a3, a4, b1, b2, c, cTpt} from "../tree-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const fetchOneResult = await pool.acquire(async (connection) => {
        await connection.exec(createCTableSql);

        const a1InsertResult = await a1.insertOne(
            connection,
            {
                a1Name : "a1",
                createdAt : new Date(0),
            }
        );
        const a2InsertResult = await a2.insertOne(
            connection,
            {
                a2Name : "a2",
                createdAt : new Date(0),
            }
        );
        const a3InsertResult = await a3.insertOne(
            connection,
            {
                a3Name : "a3",
                createdAt : new Date(0),
            }
        );
        const a4InsertResult = await a4.insertOne(
            connection,
            {
                a4Name : "a4",
                createdAt : new Date(0),
            }
        );

        const b1InsertResult = await b1.insertOne(
            connection,
            {
                a1Id : a1InsertResult.a1Id,
                a2Id : a2InsertResult.a2Id,
                a1Name : "a1",
                b1Name : "b1",
                createdAt : new Date(0),
            }
        );

        await b2.insertOne(
            connection,
            {
                a3Id : a3InsertResult.a3Id,
                a4Id : a4InsertResult.a4Id,
                b2Name : "b2",
                createdAt : new Date(0),
            }
        );

        await c.insertOne(
            connection,
            {
                b1Id : b1InsertResult.b1Id,
                a3Id : a3InsertResult.a3Id,
                b2Name : "b2",
                createdAt : new Date(0),
            }
        );

        return cTpt.fetchOne(
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
        );
    });

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

    t.end();
});
