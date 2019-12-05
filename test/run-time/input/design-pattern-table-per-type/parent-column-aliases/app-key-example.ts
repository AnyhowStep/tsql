
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.parentColumnAliases(
                browserAppKeyTpt
            ),
            [
                "appId",
                "appKeyId",
                "appKeyTypeId",
                "key",
                "createdAt",
                "disabledAt",
            ]
        )
    );

    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.parentColumnAliases(
                serverAppKeyTpt
            ),
            [
                "appId",
                "appKeyId",
                "appKeyTypeId",
                "key",
                "createdAt",
                "disabledAt",
            ]
        )
    );

    t.end();
});
