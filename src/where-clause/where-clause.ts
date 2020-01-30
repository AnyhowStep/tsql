import {IAnonymousExpr} from "../expr";

/**
 * The `WHERE` clause of a query.
 */
export type WhereClause = IAnonymousExpr<boolean, false>;
