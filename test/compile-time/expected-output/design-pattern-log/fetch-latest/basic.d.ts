import * as tsql from "../../../../../dist";
export declare const fetchLatest: tsql.ExecutionUtil.FetchOnePromise<{
    readonly custom: string;
    readonly appKeyId: bigint;
    readonly appKeyCustomId: bigint;
    readonly rwc_akc_updatedAt: Date;
}>;
export declare const fetchLatestOr: Promise<bigint | {
    readonly custom: string;
    readonly appKeyId: bigint;
    readonly appKeyCustomId: bigint;
    readonly rwc_akc_updatedAt: Date;
}>;
export declare const fetchLatestOrUndefined: Promise<{
    readonly custom: string;
    readonly appKeyId: bigint;
    readonly appKeyCustomId: bigint;
    readonly rwc_akc_updatedAt: Date;
} | undefined>;
