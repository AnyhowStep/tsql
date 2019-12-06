
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.false(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            browserAppKeyTpt,
            "key"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            browserAppKeyTpt,
            "appKeyId"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            browserAppKeyTpt,
            "createdAt"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            browserAppKeyTpt,
            "referer"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            browserAppKeyTpt,
            "doesNotExist"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            serverAppKeyTpt,
            "appKeyTypeId"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            serverAppKeyTpt,
            "disabledAt"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            serverAppKeyTpt,
            "ipAddress"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            serverAppKeyTpt,
            "trustProxy"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            serverAppKeyTpt,
            "appId"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isExplicitDefaultValueColumnAlias(
            serverAppKeyTpt,
            "doesNotExist"
        )
    );

    t.end();
});
