import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.true(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            browserAppKeyTpt,
            "key"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            browserAppKeyTpt,
            "appKeyId"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            browserAppKeyTpt,
            "createdAt"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            browserAppKeyTpt,
            "referer"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            browserAppKeyTpt,
            "doesNotExist"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            serverAppKeyTpt,
            "appKeyTypeId"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            serverAppKeyTpt,
            "disabledAt"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            serverAppKeyTpt,
            "ipAddress"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            serverAppKeyTpt,
            "trustProxy"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            serverAppKeyTpt,
            "appId"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isParentColumnAlias(
            serverAppKeyTpt,
            "doesNotExist"
        )
    );

    t.end();
});
