import * as tsql from "../../../../../dist";
export declare const row: tsql.ExecutionUtil.FetchOnePromise<{
    readonly myTable: {
        readonly myTableId: bigint;
    };
    readonly otherTable: {
        readonly myTableId: bigint;
    };
    readonly __aliased: {
        readonly value: 42;
    };
}>;
