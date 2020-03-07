import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const avgImpl : AggregateOperator2<boolean, number|null, number|null> = makeAggregateOperator2<OperatorType.AGGREGATE_AVERAGE, boolean, number|null, number|null>(
    OperatorType.AGGREGATE_AVERAGE,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);

/**
 * Returns the average value of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_avg
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#avg
 *
 * -----
 *
 * + MySQL      : `AVG(DISTINCT x)`
 * + PostgreSQL : `AVG(DISTINCT x)`
 * + SQLite     : `AVG(DISTINCT x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 */
export const avgDistinct : AggregateOperator1<number|null, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return avgImpl(true, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

/**
 * Returns the average value of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_avg
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#avg
 *
 * -----
 *
 * + MySQL      : `AVG(x)`
 * + PostgreSQL : `AVG(x)`
 * + SQLite     : `AVG(x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 */
export const avgAll : AggregateOperator1<number|null, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return avgImpl(false, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

/**
 * Returns the average value of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_avg
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#avg
 *
 * -----
 *
 * + MySQL      : `AVG(x)`
 * + PostgreSQL : `AVG(x)`
 * + SQLite     : `AVG(x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 */
export const avg = avgAll;
