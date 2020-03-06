import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator1} from "../../aggregate-factory";

/**
 * Returns the sample variance of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * It returns `NULL` if there is only one non-`NULL` value.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_var-samp
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 *
 * -----
 *
 * + MySQL      : `VAR_SAMP(x)`
 *   + Always returns `double`
 * + PostgreSQL : `VAR_SAMP(x)`
 *   + Returns `double precision` if argument is `double precision`; `numeric` otherwise
 * + SQLite     : None. Implement with user-defined function.
 *
 * Should only be provided for `double` because MySQL treats all `x` as `double`.
 *
 * -----
 *
 * The sample variance is,
 * ```sql
 *  -- SUM() and AVG() should ignore rows with `NULL` values
 *  SUM(
 *      POW((x - AVG(x), 2)
 *  ) /
 *  (COUNT(x) - 1) -- Returns a count of the number of rows with non-`NULL` values.
 * ```
 *
 * Of course, you can't use the above expression because you cannot nest aggregate functions.
 * (Cannot use `AVG()` inside of `SUM()`)
 */
export const varSamp = makeAggregateOperator1<OperatorType.AGGREGATE_SAMPLE_VARIANCE, number|null, number|null>(
    OperatorType.AGGREGATE_SAMPLE_VARIANCE,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
