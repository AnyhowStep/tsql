import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";
export declare const eqCandidateKeyOfTable: tsql.EqCandidateKeyOfTable;
export declare const expr: tsql.ExprImpl<tm.Mapper<unknown, boolean>, tsql.IUsedRef<{
    readonly myTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly createdAt: Date;
    };
    readonly childTable: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly accessedAt: Date;
    };
    readonly myTable2: {
        readonly userId: bigint;
        readonly computerId: string;
        readonly createdAt: Date;
    };
}>>;
