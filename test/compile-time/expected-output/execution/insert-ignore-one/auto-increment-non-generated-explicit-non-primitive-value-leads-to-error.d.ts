import * as tsql from "../../../../../dist";
export declare const p: Promise<(tsql.IgnoredInsertOneResult & {
    testId: undefined;
}) | (tsql.InsertOneResult & {
    autoIncrementId: bigint;
} & {
    testId: bigint;
})>;
