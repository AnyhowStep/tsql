import * as tsql from "../../../../../dist";
export declare const fetchedRow0: tsql.ExecutionUtil.FetchOnePromise<{
    readonly myTable: {
        readonly createdAt: Date;
        readonly myTableId: bigint;
    };
    readonly __aliased: {
        readonly createdAt: Date;
    };
}>;
export declare const fetchedRow1: tsql.ExecutionUtil.FetchOnePromise<{
    readonly myTable: {
        readonly createdAt: Date;
        readonly myTableId: bigint;
    };
    readonly __aliased: {
        readonly myTableId: Date;
    };
}>;
