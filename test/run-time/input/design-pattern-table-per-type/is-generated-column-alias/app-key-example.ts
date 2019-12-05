import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.true(
        tsql.TablePerTypeUtil.isGeneratedColumnAlias(
            browserAppKeyTpt,
            "appKeyId"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isGeneratedColumnAlias(
            browserAppKeyTpt,
            "createdAt"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isGeneratedColumnAlias(
            browserAppKeyTpt,
            "referer"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isGeneratedColumnAlias(
            browserAppKeyTpt,
            "doesNotExist"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isGeneratedColumnAlias(
            serverAppKeyTpt,
            "appKeyTypeId"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isGeneratedColumnAlias(
            serverAppKeyTpt,
            "disabledAt"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isGeneratedColumnAlias(
            serverAppKeyTpt,
            "ipAddress"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isGeneratedColumnAlias(
            serverAppKeyTpt,
            "doesNotExist"
        )
    );

    t.end();
});
