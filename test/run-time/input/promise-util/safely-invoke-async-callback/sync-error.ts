import * as tape from "tape";
import * as tsql from "../../../../../dist";

tape(__filename, async (t) => {
    await tsql.PromiseUtil.invokeAsyncCallbackSafely(
        () => {
            throw new Error("sync error");
        },
        () => {
            t.fail("Should throw error");
        },
        (err) => {
            t.deepEqual(err.message, "sync error");
        }
    );

    t.end();
});
