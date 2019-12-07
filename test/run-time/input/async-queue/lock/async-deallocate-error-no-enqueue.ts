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
    await queue.lock(() => {
        return Promise.resolve(1);
    }).then((result) => {
        t.deepEqual(result, 1);
    }).catch((err) => {
        t.fail(String(err));
    });

    await queue.lock(() => {
        return Promise.resolve(1);
    }).then((result) => {
        t.deepEqual(result, 1);
    }).catch((err) => {
        t.fail(String(err));
    });

    await queue.enqueue(() => {
        return Promise.resolve(1);
    }).then((result) => {
        t.deepEqual(result, 1);
    }).catch((err) => {
        t.fail(String(err));
    });

    t.end();
});
