import * as tsql from "../../../../../../../dist";
export declare const eqPrimaryKeyOfTable: tsql.EqPrimaryKeyOfTable;
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly myTable: {
        readonly userId: bigint;
        readonly computerId: "hi";
        readonly createdAt: Date;
    };
    readonly childTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly accessedAt: Date;
    };
}>>;
