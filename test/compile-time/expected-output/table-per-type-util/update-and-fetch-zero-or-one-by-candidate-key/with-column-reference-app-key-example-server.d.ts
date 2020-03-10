import * as tsql from "../../../../../dist";
export declare const result: Promise<tsql.ExecutionUtil.NotFoundUpdateAndFetchResult | tsql.TablePerTypeUtil.UpdateAndFetchOneResult<{
    readonly key: string;
    readonly appId: bigint;
    readonly appKeyId: bigint;
    readonly disabledAt: Date | null;
    readonly createdAt: Date;
    readonly appKeyTypeId: import("../app-key-example").AppKeyTypeId.SERVER;
    readonly ipAddress: string;
    readonly trustProxy: boolean;
}>>;
