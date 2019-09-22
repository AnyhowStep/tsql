import * as tsql from "../../../../../../../dist";
export declare const eqCandidateKeyOfTable: tsql.EqCandidateKeyOfTable;
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly myTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly createdAt: Date;
    };
    readonly childTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly createdAt: Date;
        readonly accessedAt: Date;
    };
}>>;
