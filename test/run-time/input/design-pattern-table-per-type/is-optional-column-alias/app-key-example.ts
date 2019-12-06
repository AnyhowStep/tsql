import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.false(
        tsql.TablePerTypeUtil.isOptionalColumnAlias(
            browserAppKeyTpt,
            "appKeyId"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isOptionalColumnAlias(
            browserAppKeyTpt,
            "createdAt"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isOptionalColumnAlias(
            browserAppKeyTpt,
            "referer"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isOptionalColumnAlias(
            browserAppKeyTpt,
            "doesNotExist"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isOptionalColumnAlias(
            serverAppKeyTpt,
            "appKeyTypeId"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isOptionalColumnAlias(
            serverAppKeyTpt,
            "disabledAt"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isOptionalColumnAlias(
            serverAppKeyTpt,
            "ipAddress"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isOptionalColumnAlias(
            serverAppKeyTpt,
            "trustProxy"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isOptionalColumnAlias(
            serverAppKeyTpt,
            "doesNotExist"
        )
    );

    t.end();
});
