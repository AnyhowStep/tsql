import {serverAppKeyTpt} from "../app-key-example";

export const result = serverAppKeyTpt.updateAndFetchOneByCandidateKey(
    null as any,
    {
        appKeyId : BigInt(1),
    },
    () => {
        return {
            ipAddress : "ip2",
            trustProxy : true,
            key : "server2",
            disabledAt : new Date(4),
        };
    }
);
