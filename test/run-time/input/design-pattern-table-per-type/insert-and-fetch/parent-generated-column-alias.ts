import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

const top = tsql.table("top")
    .addColumns({
        appKeyId : tsql.dtBigIntSigned(),
        a : tsql.dtBigIntSigned(),
        b : tsql.dtBigIntSigned(),
        generated : tsql.dtBigIntSigned(),
    })
    .setAutoIncrement(c => c.appKeyId);

const mid = tsql.table("mid")
    .addColumns({
        appKeyId : tsql.dtBigIntSigned(),
        generated : tsql.dtBigIntSigned(),
    })
    .setAutoIncrement(c => c.appKeyId)
    .addGenerated(columns => [columns.generated]);

const btm = tsql.table("btm")
    .addColumns({
        appKeyId : tsql.dtBigIntSigned(),
        generated : tsql.dtBigIntSigned(),
    })
    .setAutoIncrement(c => c.appKeyId);

const btmTpt = tsql.tablePerType(btm)
    .addParent(mid)
    .addParent(top);

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const fetchOneResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE top (
                appKeyId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                a INTEGER NOT NULL,
                b INTEGER NOT NULL,
                generated INTEGER NOT NULL
            );
            CREATE TABLE mid (
                appKeyId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                generated INTEGER NOT NULL DEFAULT 9001
            );
            CREATE TABLE btm (
                appKeyId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                generated INTEGER NOT NULL
            );
        `);

        const insertResult = await btmTpt.insertAndFetch(
            connection,
            {
                a : BigInt(10),
                b : tsql.integer.add(BigInt(20), BigInt(5)),
            }
        );

        t.deepEqual(
            insertResult,
            {
                appKeyId : BigInt(1),
                a : BigInt(10),
                b : BigInt(25),
                generated : BigInt(9001),
            }
        );

        return btmTpt.fetchOne(
            connection,
            (columns) => tsql.eq(
                columns.mid.appKeyId,
                BigInt(1)
            )
        ).orUndefined();
    });

    t.deepEqual(
        fetchOneResult,
        {
            appKeyId : BigInt(1),
            a : BigInt(10),
            b : BigInt(25),
            generated : BigInt(9001),
        }
    );

    await pool.disconnect();t.end();
});
