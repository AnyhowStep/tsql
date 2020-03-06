import {IFromClause} from "../../from-clause";
import {IJoin} from "../../../join";

/**
 * A correlated subquery is a subquery that contains a reference to a table that also appears in the outer query.
 *
 * https://dev.mysql.com/doc/refman/8.0/en/correlated-subqueries.html
 */
export interface Correlated extends IFromClause<{
    outerQueryJoins : readonly IJoin[],
    currentJoins : (readonly IJoin[])|undefined,
}> {

}
