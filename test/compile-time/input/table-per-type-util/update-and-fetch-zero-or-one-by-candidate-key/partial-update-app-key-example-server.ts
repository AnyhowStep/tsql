import {serverAppKeyTpt} from "../app-key-example";

export const result = serverAppKeyTpt.updateAndFetchZeroOrOneByCandidateKey(
    null as any,
    {
        appKeyId : BigInt(1),
    },
    () => {
        return {
            ipAddress : null,
            key : "server2",
            disabledAt : new Date(4),
        };
    }
);
