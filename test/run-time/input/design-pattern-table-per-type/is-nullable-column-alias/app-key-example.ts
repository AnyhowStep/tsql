import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.false(
        tsql.TablePerTypeUtil.isNullableColumnAlias(
            browserAppKeyTpt,
            "appKeyId"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isNullableColumnAlias(
            browserAppKeyTpt,
            "createdAt"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isNullableColumnAlias(
            browserAppKeyTpt,
            "referer"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isNullableColumnAlias(
            browserAppKeyTpt,
            "doesNotExist"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isNullableColumnAlias(
            serverAppKeyTpt,
            "appKeyTypeId"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isNullableColumnAlias(
            serverAppKeyTpt,
            "disabledAt"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isNullableColumnAlias(
            serverAppKeyTpt,
            "ipAddress"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isNullableColumnAlias(
            serverAppKeyTpt,
            "trustProxy"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isNullableColumnAlias(
            serverAppKeyTpt,
            "doesNotExist"
        )
    );

    t.end();
});
