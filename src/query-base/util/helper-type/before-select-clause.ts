import {IQueryBase} from "../../query-base";
import {IFromClause} from "../../../from-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";
import {MapDelegate} from "../../../map-delegate";

export type BeforeSelectClause = (
    IQueryBase<{
        fromClause : IFromClause,
        selectClause : undefined,

        limitClause : LimitClause|undefined,

        compoundQueryClause : CompoundQueryClause|undefined,
        compoundQueryLimitClause : LimitClause|undefined,

        mapDelegate : MapDelegate|undefined,
    }>
);
