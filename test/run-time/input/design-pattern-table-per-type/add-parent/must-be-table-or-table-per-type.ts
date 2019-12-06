import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKey} from "../app-key-example";

tape(__filename, async (t) => {
    t.throws(() => {
        tsql.tablePerType(browserAppKey)
            .addParent({} as any);
    });

    t.end();
});
