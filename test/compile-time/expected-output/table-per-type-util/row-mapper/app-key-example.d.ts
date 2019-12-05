export declare const browser: import("type-mapping").Mapper<unknown, {
    key: string;
    appId: bigint;
    appKeyId: bigint;
    disabledAt: Date | null;
    createdAt: Date;
    appKeyTypeId: import("../app-key-example").AppKeyTypeId.BROWSER;
    referer: string | null;
}>;
export declare const server: import("type-mapping").Mapper<unknown, {
    key: string;
    appId: bigint;
    appKeyId: bigint;
    disabledAt: Date | null;
    createdAt: Date;
    appKeyTypeId: import("../app-key-example").AppKeyTypeId.SERVER;
    ipAddress: string | null;
    trustProxy: boolean;
}>;
