import * as tsql from "../../../../../../../dist";
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly myTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly createdAt: Date;
    };
    readonly childTable: {
        readonly userId: bigint | null;
        readonly computerId: string | null;
        readonly accessedAt: Date;
    };
}>>;
