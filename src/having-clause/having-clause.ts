import {IAnonymousExpr} from "../expr";

/**
 * The `HAVING` clause of a query.
 *
 * This is not meant to be used as a generic type parameter constraint.
 *
 * -----
 *
 * For now, it's basically the same as the `WHERE` clause.
 *
 * At some point, they should diverge when `WHERE` clause is prevented
 * from using aggregation functions.
 */
export type HavingClause = IAnonymousExpr<boolean>;
