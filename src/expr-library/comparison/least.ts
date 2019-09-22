import {makeProjection2ToN, Projection2ToN} from "../factory";
import {OperatorType} from "../../operator-type";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#function_least
 *
 * This version of the `LEAST(x, y, ...)` operator prevents `NULL`.
 *
 * No null-safe version is provided in this unification
 * because the different databases treat `NULL` arguments differently.
 *
 * MySQL and SQLite will return `NULL` if at least one argument is `NULL`.
 * PostgreSQL will return `NULL` only if **all** arguments are `NULL`.
 *
 * -----
 *
 * This version of the `LEAST(x, y, ...)` operator requires
 * at least 2 arguments because MySQL's requires at least 2.
 *
 * Also, it does not make much sense to get the `LEAST` of 1 value.
 */
export const least : Projection2ToN = makeProjection2ToN(
    OperatorType.LEAST
);
