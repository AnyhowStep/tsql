import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    const queue = new tsql.AsyncQueue(() => {
        return {
            item : undefined,
            deallocate : () => Promise.resolve()
        };
    });
    await queue.lock(() => {
        throw new Error("sync error");
    }).then(() => {
        t.fail("Should have error");
    }).catch((err) => {
        t.deepEqual(err.message, "sync error");
    });

    t.end();
});
