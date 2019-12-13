import {browserAppKeyTpt} from "../app-key-example";

export const narrowToNull = browserAppKeyTpt.insertAndFetch(
    null as any,
    {
        appId : BigInt(1),
        key : "key",
        referer : null,
        disabledAt : null,
    }
);

export const narrowToNonNull = browserAppKeyTpt.insertAndFetch(
    null as any,
    {
        appId : BigInt(1),
        key : "key",
        referer : "hi",
        disabledAt : new Date(),
    }
);

export const narrowToLiteral = browserAppKeyTpt.insertAndFetch(
    null as any,
    {
        appId : BigInt(1),
        key : "key",
        referer : "hi",
        disabledAt : new Date(),
    } as const
);
