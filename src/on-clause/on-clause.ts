import {IAnonymousExpr} from "../expr";

/**
 * The `ON` clause of a `JOIN`.
 *
 * `FROM` and `CROSS JOIN` do not have an `ON` clause.
 *
 * -----
 *
 * Also called a `join condition`.
 *
 * Information technology - Database languages - SQL - Part 2: Foundation (SQL/Foundation) Ed 5
 *
 * -----
 *
 * The `ON` clause may reference outer query tables,
 *
 * https://docs.oracle.com/javadb/10.8.3.0/ref/rrefsqlj35034.html
 * > The scope of expressions in the `ON` clause includes the current tables
 * > and any tables in outer query blocks to the current `SELECT`.
 */
export type OnClause = IAnonymousExpr<boolean, false>;
