import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";
import {MapDelegate} from "../../../map-delegate";
import {GroupByClause} from "../../../group-by-clause";

export interface AfterCompoundQueryClause extends IQueryBase<{
    fromClause : IFromClause,
    selectClause : SelectClause|undefined,

    limitClause : LimitClause|undefined,

    compoundQueryClause : CompoundQueryClause,
    compoundQueryLimitClause : LimitClause|undefined,

    mapDelegate : MapDelegate|undefined,
    groupByClause : GroupByClause|undefined,
}> {

}
