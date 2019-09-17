import {QueryBaseUtil} from "../../../query-base";
import {SelectClauseUtil} from "../../../select-clause";
import {IJoin} from "../../../join";

/**
 * + Assumes `QueryT` is not a union.
 */
export type CanFlattenUnmappedRow<
    QueryT extends Pick<QueryBaseUtil.AfterSelectClause, "selectClause"|"fromClause">
> =
    SelectClauseUtil.DuplicateColumnAlias<QueryT["selectClause"]> extends never ?
    (
        QueryT["fromClause"]["currentJoins"] extends readonly IJoin[] ?
        (
            true extends QueryT["fromClause"]["currentJoins"][number]["nullable"] ?
            /**
             * Cannot flatten if we have `nullable` joins.
             * Flattening causes us to not know which tables were "nulled out".
             */
            false :
            /**
             * No `nullable` joins, we can flatten safely
             */
            true
        ) :
        /**
         * No `nullable` joins, we can flatten safely
         */
        true
    ) :
    /**
     * Cannot flatten if we have duplicate `columnAlias`
     */
    false
;
export function canFlattenUnmappedRow<
    QueryT extends Pick<QueryBaseUtil.AfterSelectClause, "selectClause"|"fromClause">
>(query : QueryT) {
    if (SelectClauseUtil.duplicateColumnAlias(query.selectClause).length > 0) {
        /**
         * Cannot flatten if we have duplicate `columnAlias`
         */
        return false;
    }
    if (query.fromClause.currentJoins == undefined) {
        /**
         * No `nullable` joins, we can flatten safely
         */
        return true;
    }
    const hasNullableJoins = query.fromClause.currentJoins.some(j => j.nullable);
    return !hasNullableJoins;
}
