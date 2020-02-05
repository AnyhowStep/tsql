import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let i=0; i<=255; ++i) {
                const bytes = Buffer.from(String.fromCharCode(i), "binary");
                const str = bytes.toString("hex").toUpperCase();
                await tsql
                    .selectValue(() => tsql.hex(bytes))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(
                            value,
                            str,
                            `HEX(${bytes}) = ${str}`
                        );
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
            const bytes = [0, 32, 64, 128, 233, 255, 127, 95, 88];
            const str = Buffer.from(bytes).toString("hex").toUpperCase();
            await tsql
                .selectValue(() => tsql.hex(Buffer.from(bytes)))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, str, `HEX(${bytes.join(", ")}) = ${str}`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
