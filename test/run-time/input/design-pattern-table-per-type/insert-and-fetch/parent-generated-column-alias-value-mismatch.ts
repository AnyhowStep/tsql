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

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE top (
                appKeyId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                a INTEGER NOT NULL,
                b INTEGER NOT NULL,
                generated INTEGER NOT NULL
            );
            CREATE TABLE mid (
                appKeyId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                -- This will cause a mismatch value error
                generated INTEGER NOT NULL DEFAULT 9002
            );
            CREATE TABLE btm (
                appKeyId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                generated INTEGER NOT NULL
            );
        `);

        await btmTpt.insertAndFetch(
            connection,
            {
                a : BigInt(10),
                b : tsql.integer.add(BigInt(20), BigInt(5)),
            }
        ).then(() => {
            t.fail("9001 != 9002, should not insert");
        }).catch((err) => {
            t.deepEqual(err.message, "All columns with the same name in an inheritance hierarchy must have the same value; mismatch found for mid.generated");
        });
    });

    await pool.disconnect();t.end();
});
