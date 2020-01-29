import {IAnonymousExpr} from "../expr";

/**
 * The `HAVING` clause of a query.
 *
 * -----
 *
 * For now, it's basically the same as the `WHERE` clause.
 *
 * At some point, they should diverge when `WHERE` clause is prevented
 * from using aggregation functions.
 */
export type HavingClause = IAnonymousExpr<boolean, boolean>;
