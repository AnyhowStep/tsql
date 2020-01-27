import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {LimitClause} from "../../../limit-clause";
import {MapDelegate} from "../../../map-delegate";
import {GroupByClause} from "../../../group-by-clause";

export type BeforeCompoundQueryClause = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

        compoundQueryClause : undefined,
        compoundQueryLimitClause : LimitClause|undefined,

        mapDelegate : MapDelegate|undefined,
        groupByClause : GroupByClause|undefined,
    }>
);
