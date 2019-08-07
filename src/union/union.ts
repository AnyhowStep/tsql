import {QueryBaseUtil} from "../query-base";

export interface UnionData {
    /**
     * Defaults to `true`.
     *
     * Used for `UNION DISTINCT` or `UNION ALL`.
     */
    readonly isDistinct : boolean;
    readonly query : QueryBaseUtil.AfterSelectClause;
}
