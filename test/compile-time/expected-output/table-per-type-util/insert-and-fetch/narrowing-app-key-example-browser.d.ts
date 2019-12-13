export declare const narrowToNull: Promise<{
    readonly key: string;
    readonly appId: bigint;
    readonly appKeyId: bigint;
    readonly disabledAt: null;
    readonly createdAt: Date;
    readonly appKeyTypeId: import("../app-key-example").AppKeyTypeId.BROWSER;
    readonly referer: null;
}>;
export declare const narrowToNonNull: Promise<{
    readonly key: string;
    readonly appId: bigint;
    readonly appKeyId: bigint;
    readonly disabledAt: Date;
    readonly createdAt: Date;
    readonly appKeyTypeId: import("../app-key-example").AppKeyTypeId.BROWSER;
    readonly referer: string;
}>;
export declare const narrowToLiteral: Promise<{
    readonly key: "key";
    readonly appId: bigint;
    readonly appKeyId: bigint;
    readonly disabledAt: Date;
    readonly createdAt: Date;
    readonly appKeyTypeId: import("../app-key-example").AppKeyTypeId.BROWSER;
    readonly referer: "hi";
}>;
