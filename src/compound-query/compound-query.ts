import {QueryBaseUtil} from "../query-base";

export enum CompoundQueryType {
    UNION       = "UNION",
    INTERSECT   = "INTERSECT",
    EXCEPT      = "EXCEPT",
}

export interface CompoundQuery {
    /**
     * We have an enum with all three compound query types
     * but we will only use `UNION` for the unified library.
     *
     * The database+version-specific libraries may use the other
     * compound query types.
     */
    compoundQueryType : CompoundQueryType,

    /**
     * Defaults to `true`.
     *
     * Used for `UNION DISTINCT` or `UNION ALL`.
     *
     * For SQLite, you cannot write `UNION DISTINCT`.
     * You can only write,
     * + `UNION` (The `DISTINCT` is implied)
     * + `UNION ALL`
     *
     * -----
     *
     * For `INTERSECT` and `EXCEPT`, this is always `true` because
     * SQLite does not allow the `DISTINCT|ALL` keywords for those two clauses.
     *
     * -----
     *
     * This library will only allow,
     * + `UNION` (distinct implied)
     * + `UNION ALL`
     * + `INTERSECT` (distinct implied)
     * + `EXCEPT` (distinct implied)
     */
    readonly isDistinct : boolean;
    readonly query : QueryBaseUtil.AfterSelectClause;
}
