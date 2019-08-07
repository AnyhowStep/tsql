import {IQuery} from "../../query";
import {FromClauseUtil} from "../../../from-clause";
import {SelectClause} from "../../../select-clause";
import {UnionClause} from "../../../union-clause";
import {LimitData} from "../../../limit";

/**
 * A correlated subquery is a subquery that contains a reference to a table that also appears in the outer query.
 *
 * https://dev.mysql.com/doc/refman/8.0/en/correlated-subqueries.html
 */
export type Correlated = (
    IQuery<{
        fromClause : FromClauseUtil.Correlated,
        selectClause : SelectClause|undefined,

        limitClause : LimitData|undefined,

        unionClause : UnionClause|undefined,
        unionLimitClause : LimitData|undefined,
    }>
);
