import * as tsql from "../../../../../../../dist";
/**
 * @todo Should this even be allowed?
 * `computerId` of both tables are disjoint types.
 * This should always be `FALSE`.
 */
export declare const expr: tsql.ExprImpl<boolean, tsql.IUsedRef<{
    readonly childTable: {
        readonly userId: bigint;
        readonly computerId: "bye";
        readonly accessedAt: Date;
    };
    readonly myTable: {
        readonly userId: bigint;
        readonly computerId: "hi";
        readonly createdAt: Date;
    };
}>, false>;
