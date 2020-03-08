import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let a=-100; a<=100; ++a) {
                for (let b=-100; b<=100; ++b) {
                    await tsql
                        .selectValue(() => tsql.integer.sub(
                            BigInt(a),
                            BigInt(b)
                        ))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, BigInt(a-b), `${a}-${b} = ${a-b}`);
                        })
                        .catch((err) => {
                            t.fail(err.message);
                        });
                }
            }

        });

        t.end();
    });
};
