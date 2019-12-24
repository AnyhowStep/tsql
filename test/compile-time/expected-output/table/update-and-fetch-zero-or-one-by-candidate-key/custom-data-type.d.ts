import * as tsql from "../../../../../dist";
export declare const p: Promise<tsql.ExecutionUtil.NotFoundUpdateAndFetchResult | (tsql.ExecutionUtil.UpdateOneResult & {
    row: {
        readonly testId: bigint;
        readonly testVal: {
            x: number;
            y: number;
        };
    };
})>;
