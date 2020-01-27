import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {LimitClause} from "../../../limit-clause";
import {MapDelegate} from "../../../map-delegate";
import {GroupByClause} from "../../../group-by-clause";

/**
 * To guarantee a query returns one row only,
 * you cannot have a `FROM` clause or `COMPOUND QUERY` clause.
 */
export type OneRow = (
    IQueryBase<{
        fromClause : FromClauseUtil.BeforeFromClause,
        selectClause : SelectClause|undefined,

        limitClause : LimitClause|undefined,

        compoundQueryClause : undefined,
        compoundQueryLimitClause : LimitClause|undefined,

        mapDelegate : MapDelegate|undefined,
        groupByClause : GroupByClause|undefined,
    }>
);
