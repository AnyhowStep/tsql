import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";
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
    readonly childTable2: {
        readonly userId: bigint | null;
        readonly computerId: string | null;
        readonly accessedAt2: Date;
    };
}>>;
