import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.generatedColumnAliases(
                browserAppKeyTpt
            ),
            ["appKeyTypeId"]
        )
    );

    t.true(
        tsql.KeyUtil.isEqual(
            tsql.TablePerTypeUtil.generatedColumnAliases(
                serverAppKeyTpt
            ),
            ["appKeyTypeId"]
        )
    );

    t.end();
});
