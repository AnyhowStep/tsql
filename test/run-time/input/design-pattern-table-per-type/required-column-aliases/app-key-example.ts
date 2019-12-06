
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.requiredColumnAliases(
                browserAppKeyTpt
            ),
            ["appId", "key"]
        )
    );

    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.requiredColumnAliases(
                serverAppKeyTpt
            ),
            ["appId", "key"]
        )
    );

    t.end();
});
