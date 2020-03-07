import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator1, AggregateOperator1} from "../../aggregate-factory";

/**
 * Returns the max value of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_max
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_corefunc.html#maxoreunc
 *
 * -----
 *
 * + MySQL      : `MAX(x)`
 * + PostgreSQL : `MAX(x)`
 * + SQLite     : `MAX(x)`
 */
export const max : AggregateOperator1<number|null, number|null> = makeAggregateOperator1<OperatorType.AGGREGATE_MAX, number|null, number|null>(
    OperatorType.AGGREGATE_MAX,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);
