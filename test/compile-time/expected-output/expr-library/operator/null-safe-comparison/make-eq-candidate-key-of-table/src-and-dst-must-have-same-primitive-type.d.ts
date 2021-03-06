import * as tsql from "../../../../../../../dist";
export declare const eqCandidateKeyOfTable: tsql.EqCandidateKeyOfTable;
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly childTable: {
        readonly userId: bigint | null;
        readonly computerId: "hello" | null;
        readonly accessedAt: Date;
    };
    readonly myTable: {
        readonly userId: 1n | null;
        readonly computerId: string | null;
        readonly createdAt: Date;
    };
}>, false>;
