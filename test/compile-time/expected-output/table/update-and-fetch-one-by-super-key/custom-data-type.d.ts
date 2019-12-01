import * as tsql from "../../../../../dist";
export declare const p: Promise<tsql.ExecutionUtil.UpdateOneResult & {
    row: {
        readonly testId: bigint;
        readonly testVal: {
            x: number;
            y: number;
        };
    };
}>;
export declare const p2: Promise<tsql.ExecutionUtil.UpdateOneResult & {
    row: {
        readonly testId: 3n;
        readonly testVal: null;
    };
}>;
