import {IFromClause} from "../../from-clause";
import {IJoin} from "../../../join";

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
    IFromClause<{
        outerQueryJoins : undefined,
        currentJoins : (readonly IJoin[])|undefined,
    }>
);
