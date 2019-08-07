import {IAnonymousExpr} from "../expr";

/**
 * The `WHERE` clause of a query.
 *
 * This is not meant to be used as a generic type parameter constraint.
 */
export type WhereClause = IAnonymousExpr<boolean>|undefined;
