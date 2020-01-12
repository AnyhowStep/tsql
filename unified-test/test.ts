import * as tsql from "../dist";
import {UnifiedSchema} from ".";

export type Test = (
    args : {
        tape : typeof import("tape"),
        pool : tsql.IPool,
        createTemporarySchema : (
            connection : tsql.IConnection,
            schema : UnifiedSchema
        ) => Promise<void>,
    }
) => void;
