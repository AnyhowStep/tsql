import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    const queue = new tsql.AsyncQueue(() => {
        return {
            item : undefined,
            deallocate : () => {
                return Promise.reject(new Error("deallocate error"));
            }
        };
    });
    await queue.lock((queue) => {
        return queue.enqueue(() => {
            throw new Error("sync error");
        });
    }).then(() => {
        t.fail("Should not have result");
    }).catch((err) => {
        t.deepEqual(err.message, "sync error");
    });

    await queue.lock(() => {
        return Promise.resolve(1);
    }).then(() => {
        t.fail("Should not have result");
    }).catch((err) => {
        t.deepEqual(err.message, "deallocate error");
    });

    await queue.enqueue(() => {
        return Promise.resolve(1);
    }).then(() => {
        t.fail("Should not have result");
    }).catch((err) => {
        t.deepEqual(err.message, "deallocate error");
    });

    t.end();
});
