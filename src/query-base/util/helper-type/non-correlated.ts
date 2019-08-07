import {IQueryBase} from "../../query-base";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitData} from "../../../limit";

/**
 * The opposite of a correlated subquery.
 *
 * -----
 *
 * A correlated subquery is a subquery that contains a reference to a table that also appears in the outer query.
 *
 * https://dev.mysql.com/doc/refman/8.0/en/correlated-subqueries.html
 */
export type NonCorrelated = (
    IQueryBase<{
        fromClause : FromClauseUtil.NonCorrelated,
        selectClause : SelectClause|undefined,

        limitClause : LimitData|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitData|undefined,
    }>
);
