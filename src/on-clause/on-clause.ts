import {IAnonymousExpr} from "../expr";

/**
 * The `ON` clause of a `JOIN`.
 *
 * This is not meant to be used as a generic type parameter constraint.
 *
 * `FROM` and `CROSS JOIN` do not have an `ON` clause.
 */
export type OnClause = IAnonymousExpr<boolean>;
