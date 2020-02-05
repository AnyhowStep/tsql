import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape}) => {
    tape(__filename, async (t) => {
        t.throws(() => {
            tsql.lPad("a", BigInt(9), "");
        });

        t.end();
    });
};
