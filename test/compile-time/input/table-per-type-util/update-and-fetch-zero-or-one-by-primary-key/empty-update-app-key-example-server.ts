import {serverAppKeyTpt} from "../app-key-example";

export const result = serverAppKeyTpt.updateAndFetchZeroOrOneByPrimaryKey(
    null as any,
    {
        appKeyId : BigInt(1),
    },
    () => {
        return {};
    }
);
