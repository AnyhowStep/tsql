import * as tsql from "../dist";

export type Test = (
    args : {
        tape : typeof import("tape"),
        pool : tsql.IPool,
    }
) => void;
