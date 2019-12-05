import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.nonGeneratedColumnAliases(
                browserAppKeyTpt
            ),
            [
                "appId",
                "key",
                "createdAt",
                "disabledAt",
                "referer",
            ]
        )
    );

    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.nonGeneratedColumnAliases(
                serverAppKeyTpt
            ),
            [
                "appId",
                "key",
                "createdAt",
                "disabledAt",
                "ipAddress",
                "trustProxy",
            ]
        )
    );

    t.end();
});
