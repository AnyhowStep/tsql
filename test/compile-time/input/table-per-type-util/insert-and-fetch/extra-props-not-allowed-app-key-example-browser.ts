import {browserAppKeyTpt} from "../app-key-example";

export const e1 = browserAppKeyTpt.insertAndFetch(
    null as any,
    {
        appId : BigInt(1),
        key : "key",
        referer : null,
        disabledAt : null,
        extraProp : null,
    }
);
export const e2 = browserAppKeyTpt.insertAndFetch(
    null as any,
    Math.random() > 0.5 ?
    {
        appId : BigInt(1),
        key : "key",
        referer : null,
        disabledAt : null,
        extraProp : null,
    } :
    {
        appId : BigInt(1),
        key : "key",
        referer : null,
        disabledAt : null,
    }
);
export const e3 = browserAppKeyTpt.insertAndFetch(
    null as any,
    Math.random() > 0.5 ?
    {
        appId : BigInt(1),
        key : "key",
        referer : null,
        disabledAt : null,
        extraProp : null,
    } :
    {
        appId : BigInt(1),
        key : "key",
        referer : null,
        disabledAt : null,
        extraProp2 : null,
    }
);
export const e4 = browserAppKeyTpt.insertAndFetch(
    null as any,
    {
        appId : BigInt(1),
        key : "key",
        referer : null,
        disabledAt : null,
        extraProp : null,
        extraProp2 : null,
    }
);
export const e5 = browserAppKeyTpt.insertAndFetch(
    null as any,
    {
        appKeyId : BigInt(2),
        appId : BigInt(1),
        key : "key",
        referer : null,
        disabledAt : null,
    }
);
