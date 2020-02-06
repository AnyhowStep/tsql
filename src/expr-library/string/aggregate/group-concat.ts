import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator1, makeAggregateOperator2} from "../../aggregate-factory";

/**
 * Returns a string result with the concatenated non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_group-concat
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#groupconcat
 *
 * + MySQL      : `GROUP_CONCAT(DISTINCT expr SEPARATOR separator)`
 * + PostgreSQL : `STRING_AGG(DISTINCT expr, separator)`
 * + SQLite     : `GROUP_CONCAT(DISTINCT expr)`
 *   + The order of the concatenated elements is arbitrary.
 *   + Uses comma as separator
 *
 * -----
 *
 * Seems like `GROUP_CONCAT()` with `DISTINCT` cannot take a separator
 * for the DB-unified implementation.
 *
 * Unless we modify the SQLite implementation with a user-defined function?
 *
 * -----
 *
 * @param arg - The expression to aggregate
 *
 * @todo Investigate replacing SQLite `GROUP_CONCAT()` with user-defined function
 */
export const groupConcatDistinct = makeAggregateOperator1<
    OperatorType.AGGREGATE_GROUP_CONCAT_DISTINCT,
    string|null,
    string|null
>(
    OperatorType.AGGREGATE_GROUP_CONCAT_DISTINCT,
    tm.orNull(tm.string()),
    TypeHint.STRING
);

/**
 * Returns a string result with the concatenated non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_group-concat
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#groupconcat
 *
 * + MySQL      : `GROUP_CONCAT(expr SEPARATOR separator)`
 * + PostgreSQL : `STRING_AGG(expr, separator)`
 * + SQLite     : `GROUP_CONCAT(expr, separator)`
 *   + The order of the concatenated elements is arbitrary.
 *
 * @param left  - The expression to aggregate
 * @param right - The separator between expressions
 */
export const groupConcatAll = makeAggregateOperator2<
    OperatorType.AGGREGATE_GROUP_CONCAT_ALL,
    string|null,
    string,
    string|null
>(
    OperatorType.AGGREGATE_GROUP_CONCAT_ALL,
    tm.orNull(tm.string()),
    TypeHint.STRING
);
