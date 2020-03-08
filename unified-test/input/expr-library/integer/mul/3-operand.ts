import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let a=-25; a<=25; ++a) {
                for (let b=-25; b<=25; ++b) {
                    for (let c=-25; c<=25; ++c) {
                        await tsql
                            .selectValue(() => tsql.integer.mul(
                                BigInt(a),
                                BigInt(b),
                                BigInt(c)
                            ))
                            .fetchValue(connection)
                            .then((value) => {
                                t.deepEqual(value, BigInt(a*b*c), `${a}*${b}*${c} = ${a*b*c}`);
                            })
                            .catch((err) => {
                                t.fail(err.message);
                            });
                    }
                }
            }

        });

        t.end();
    });
};
