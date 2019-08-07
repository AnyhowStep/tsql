import {QueryUtil} from "../query";

export interface UnionData {
    /**
     * Defaults to `true`.
     *
     * Used for `UNION DISTINCT` or `UNION ALL`.
     */
    readonly isDistinct : boolean;
    readonly query : QueryUtil.AfterSelectClause;
}
