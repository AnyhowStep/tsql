import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {MapDelegate} from "../../../map-delegate";
import {GroupByClause} from "../../../group-by-clause";

export interface ZeroOrOneRowUsingLimit extends IQueryBase<{
    fromClause : IFromClause,
    selectClause : SelectClause|undefined,

    limitClause : {
        readonly maxRowCount : 0n|1n,
        readonly offset : bigint,
    },

    /**
     * `COMPOUND QUERY` clause not allowed
     */
    compoundQueryClause : undefined,
    compoundQueryLimitClause : undefined,

    mapDelegate : MapDelegate|undefined,
    groupByClause : GroupByClause|undefined,
}> {

}
