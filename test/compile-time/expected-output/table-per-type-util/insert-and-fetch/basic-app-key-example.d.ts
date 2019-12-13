export declare const browser: Promise<{
    readonly key: string;
    readonly appId: bigint;
    readonly appKeyId: bigint;
    readonly disabledAt: Date;
    readonly createdAt: Date;
    readonly appKeyTypeId: import("../app-key-example").AppKeyTypeId.BROWSER;
    readonly referer: null;
}>;
export declare const server: Promise<{
    readonly key: string;
    readonly appId: bigint;
    readonly appKeyId: bigint;
    readonly disabledAt: null;
    readonly createdAt: Date;
    readonly appKeyTypeId: import("../app-key-example").AppKeyTypeId.SERVER;
    readonly ipAddress: string;
    readonly trustProxy: boolean;
}>;
