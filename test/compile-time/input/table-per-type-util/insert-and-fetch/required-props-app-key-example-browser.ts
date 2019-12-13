import {browserAppKeyTpt} from "../app-key-example";

export const e1 = browserAppKeyTpt.insertAndFetch(
    null as any,
    {
        appId : BigInt(1),
    }
);

export const e2 = browserAppKeyTpt.insertAndFetch(
    null as any,
    {
        key : "",
    }
);

export const e3 = browserAppKeyTpt.insertAndFetch(
    null as any,
    {}
);

export const e4 = browserAppKeyTpt.insertAndFetch(
    null as any,
    {
        appId : BigInt(1),
        key : "",
    }
);
