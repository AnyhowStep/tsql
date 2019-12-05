import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    t.true(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            browserAppKeyTpt,
            "key"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            browserAppKeyTpt,
            "appKeyId"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            browserAppKeyTpt,
            "createdAt"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            browserAppKeyTpt,
            "referer"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            browserAppKeyTpt,
            "doesNotExist"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            serverAppKeyTpt,
            "appKeyTypeId"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            serverAppKeyTpt,
            "disabledAt"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            serverAppKeyTpt,
            "ipAddress"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            serverAppKeyTpt,
            "trustProxy"
        )
    );

    t.true(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            serverAppKeyTpt,
            "appId"
        )
    );

    t.false(
        tsql.TablePerTypeUtil.isRequiredColumnAlias(
            serverAppKeyTpt,
            "doesNotExist"
        )
    );

    t.end();
});
