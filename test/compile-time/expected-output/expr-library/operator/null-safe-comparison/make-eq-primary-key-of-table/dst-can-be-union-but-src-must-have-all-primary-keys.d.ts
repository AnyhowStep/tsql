import * as tsql from "../../../../../../../dist";
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly childTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly accessedAt: Date;
        readonly userId2: bigint;
        readonly computerId2: string;
    };
    readonly myTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly createdAt: Date;
    };
    readonly myTable2: {
        readonly userId2: bigint;
        readonly computerId2: string;
        readonly createdAt2: Date;
    };
}>>;
