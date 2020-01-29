import * as tsql from "../../../../../../../dist";
export declare const eqCandidateKeyOfTable: tsql.EqCandidateKeyOfTable;
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly childTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly accessedAt: Date;
    };
    readonly myTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly createdAt: Date;
    };
    readonly myTable2: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly createdAt: Date;
    };
}>, false>;
