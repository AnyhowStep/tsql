import {Test} from "../../../../../test";
import * as tsql from "../../../../../../dist";

export const test : Test = ({tape}) => {
    tape(__filename, async (t) => {
        t.throws(() => {
            tsql.integer.bitwiseLeftShift(BigInt(1000), BigInt(-1));
        });

        t.end();
    });
};
