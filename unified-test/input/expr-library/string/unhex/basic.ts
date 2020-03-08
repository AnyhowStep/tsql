import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let i=0; i<=255; ++i) {
                const bytes = Buffer.from(String.fromCharCode(i), "binary");
                const str = bytes.toString("hex");
                await tsql
                    .selectValue(() => tsql.unhex(str))
                    .fetchValue(connection)
                    .then((value) => {
                        if (value == undefined) {
                            t.fail(`Expected Uint8Array for UNHEX(${str})`);
                        } else {
                            t.deepEqual(
                                value,
                                value instanceof Buffer ?
                                bytes :
                                new Uint8Array(bytes),
                                `UNHEX(${str}) = ${bytes}`
                            );
                        }
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
            const bytes = [0, 32, 64, 128, 233, 255, 127, 95, 88];
            const str = Buffer.from(bytes).toString("hex");
            await tsql
                .selectValue(() => tsql.unhex(str))
                .fetchValue(connection)
                .then((value) => {
                    if (value == undefined) {
                        t.fail(`Expected Uint8Array for UNHEX(${str})`);
                    } else {
                        t.deepEqual(
                            value,
                            value instanceof Buffer ?
                            Buffer.from(bytes) :
                            new Uint8Array(bytes),
                            `UNHEX(${str}) = ${bytes.join(", ")}`
                        );
                    }
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.unhex("~"))
                .fetchValue(connection)
                .then((value) => {
                    if (value === null) {
                        t.pass(`Returning NULL is acceptable`);
                    } else {
                        t.fail(`UNHEX('~') should fail; received [${[...value.values()].join(", ")}]`);
                    }
                })
                .catch((err) => {
                    //Throwing is acceptable
                    t.pass(err.message);
                });
        });

        t.end();
    });
};
