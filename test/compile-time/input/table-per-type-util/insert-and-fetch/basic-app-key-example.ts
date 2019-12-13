import * as tsql from "../../../../../dist";
import {browserAppKeyTpt, serverAppKeyTpt} from "../app-key-example";

export const browser = tsql.TablePerTypeUtil.insertAndFetch(
    browserAppKeyTpt,
    null as any,
    {
        appId : BigInt(1),
        key : "test",
        referer : null,
        disabledAt : tsql.currentTimestamp3(),
    }
);

export const server = serverAppKeyTpt.insertAndFetch(
    null as any,
    {
        appId : BigInt(1),
        key : "test",
        disabledAt : null,
        ipAddress : "testtest",
    }
);
