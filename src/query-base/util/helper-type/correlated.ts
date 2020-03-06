import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {CompoundQueryClause} from "../../../compound-query-clause";
import {LimitClause} from "../../../limit-clause";
import {MapDelegate} from "../../../map-delegate";
import {GroupByClause} from "../../../group-by-clause";

/**
 * A correlated subquery is a subquery that contains a reference to a table that also appears in the outer query.
 *
 * https://dev.mysql.com/doc/refman/8.0/en/correlated-subqueries.html
 */
export interface Correlated extends IQueryBase<{
    fromClause : FromClauseUtil.Correlated,
    selectClause : SelectClause|undefined,

    limitClause : LimitClause|undefined,

    compoundQueryClause : CompoundQueryClause|undefined,
    compoundQueryLimitClause : LimitClause|undefined,

    mapDelegate : MapDelegate|undefined,
    groupByClause : GroupByClause|undefined,
}> {

}
