import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const value = await pool.acquire((connection) => {
        return tsql.selectValue(() => Buffer.from("hello, world"))
            .fetchValue(connection);
    });
    t.deepEqual(
        value,
        Buffer.from("hello, world")
    );

    const value2 = await pool.acquire((connection) => {
        return tsql.selectValue(() => new Uint8Array([1,2,3]))
            .fetchValue(connection);
    });
    t.deepEqual(
        value2,
        new Uint8Array([1,2,3])
    );

    const value3 = await pool.acquire((connection) => {
        return tsql.selectValue(() => new Uint8Array([1,2,3]))
            .fetchValue(connection);
    });
    t.deepEqual(
        value3,
        Buffer.from([1,2,3])
    );

    const value4 = await pool.acquire((connection) => {
        return tsql.selectValue(() => Buffer.from([1,2,3]))
            .fetchValue(connection);
    });
    t.deepEqual(
        value4,
        new Uint8Array([1,2,3])
    );

    t.end();
});
