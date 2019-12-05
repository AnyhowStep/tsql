
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.optionalColumnAliases(
                browserAppKeyTpt
            ),
            ["createdAt", "disabledAt", "referer"]
        )
    );

    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.optionalColumnAliases(
                serverAppKeyTpt
            ),
            ["createdAt", "disabledAt", "ipAddress", "trustProxy"]
        )
    );

    t.end();
});
