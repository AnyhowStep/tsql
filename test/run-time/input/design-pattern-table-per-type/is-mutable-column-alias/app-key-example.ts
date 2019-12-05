import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.false(
        tsql.TablePerTypeUtil.isMutableColumnAlias(
            browserAppKeyTpt,
            "appKeyId"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isMutableColumnAlias(
            browserAppKeyTpt,
            "createdAt"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isMutableColumnAlias(
            browserAppKeyTpt,
            "referer"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isMutableColumnAlias(
            browserAppKeyTpt,
            "doesNotExist"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isMutableColumnAlias(
            serverAppKeyTpt,
            "appKeyTypeId"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isMutableColumnAlias(
            serverAppKeyTpt,
            "disabledAt"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isMutableColumnAlias(
            serverAppKeyTpt,
            "ipAddress"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isMutableColumnAlias(
            serverAppKeyTpt,
            "doesNotExist"
        )
    );

    t.end();
});
