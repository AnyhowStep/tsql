import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";
export declare const eqCandidateKeyOfTable: tsql.EqCandidateKeyOfTable;
export declare const expr: tsql.ExprImpl<tm.Mapper<unknown, boolean>, tsql.IUsedRef<{
    readonly myTable: {
        readonly userId: bigint | null;
        readonly computerId: string | null;
        readonly createdAt: Date;
    };
    readonly childTable: {
        readonly userId: bigint | null;
        readonly computerId: string | null;
        readonly accessedAt: Date;
    };
}>>;
