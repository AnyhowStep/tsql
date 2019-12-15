import {serverAppKeyTpt} from "../app-key-example";

export const result = serverAppKeyTpt.updateAndFetchZeroOrOneByCandidateKey(
    null as any,
    {
        appKeyId : BigInt(1),
    },
    () => {
        return {};
    }
);
