import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.nullableColumnAliases(
                browserAppKeyTpt
            ),
            ["disabledAt", "referer"]
        )
    );

    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.nullableColumnAliases(
                serverAppKeyTpt
            ),
            ["disabledAt", "ipAddress"]
        )
    );

    t.end();
});
