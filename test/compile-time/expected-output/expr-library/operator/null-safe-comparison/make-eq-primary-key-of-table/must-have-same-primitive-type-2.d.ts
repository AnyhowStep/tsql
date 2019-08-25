import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../../../dist";
/**
 * @todo Should this even be allowed?
 * `computerId` of both tables are disjoint types.
 * This should always be `FALSE`.
 */
export declare const expr: tsql.ExprImpl<tm.Mapper<unknown, boolean>, tsql.IUsedRef<{
    readonly myTable: {
        readonly userId: bigint;
        readonly computerId: "hi";
        readonly createdAt: Date;
    };
    readonly childTable: {
        readonly userId: bigint;
        readonly computerId: "bye";
        readonly accessedAt: Date;
    };
}>>;
