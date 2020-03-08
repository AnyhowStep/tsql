import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => Buffer.from("hello, world"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(
                        value,
                        value instanceof Buffer ?
                        Buffer.from("hello, world") :
                        new Uint8Array(
                            "hello, world".split("").map(s => s.charCodeAt(0))
                        )
                    );
                });

            await tsql.selectValue(() => Buffer.from([1,2,3]))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(
                        value,
                        value instanceof Buffer ?
                        Buffer.from([1,2,3]) :
                        new Uint8Array([1,2,3])
                    );
                });

            await tsql.selectValue(() => new Uint8Array([1,2,3]))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(
                        value,
                        value instanceof Buffer ?
                        Buffer.from([1,2,3]) :
                        new Uint8Array([1,2,3])
                    );
                });


        });

        t.end();
    });
};
