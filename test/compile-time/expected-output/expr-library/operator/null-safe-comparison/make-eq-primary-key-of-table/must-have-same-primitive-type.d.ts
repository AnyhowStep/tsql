import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";
export declare const eqPrimaryKeyOfTable: tsql.EqPrimaryKeyOfTable;
export declare const expr: tsql.ExprImpl<tm.Mapper<unknown, boolean>, tsql.IUsedRef<{
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
