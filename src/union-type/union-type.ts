/**
 * Determines if the `UNION` clause should remove duplicate rows
 * from the result.
 *
 * You can mix `UNION ALL` and `UNION DISTINCT` in the same query.
 * Mixed `UNION` types are treated such that a `DISTINCT` union overrides
 * any `ALL` union to its left.
 */
export namespace UnionType {
    /**
     * Does not remove duplicate rows from the result.
     */
    export const ALL = "ALL";
    export type ALL = typeof ALL;

    /**
     * The default behaviour of the `UNION` clause.
     * It removes duplicate rows from the result.
     */
    export const DISTINCT = "DISTINCT";
    export type DISTINCT = typeof DISTINCT;
};

export type UnionType = (
    | typeof UnionType.ALL
    | typeof UnionType.DISTINCT
);