import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const sumImpl = makeAggregateOperator2<OperatorType.AGGREGATE_SUM, boolean, number|null, number|null>(
    OperatorType.AGGREGATE_SUM,
    tm.orNull(tm.toUnsafeNumber()),
    TypeHint.DOUBLE
);

/**
 * Returns the total sum of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_sum
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#sumunc
 *
 * -----
 *
 * + MySQL      : `SUM(DISTINCT x)`
 * + PostgreSQL : `SUM(DISTINCT x)`
 * + SQLite     : `SUM(DISTINCT x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 */
export const sumDistinct : AggregateOperator1<number|null, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return sumImpl(true, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

/**
 * Returns the total sum of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_sum
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#sumunc
 *
 * -----
 *
 * + MySQL      : `SUM(x)`
 * + PostgreSQL : `SUM(x)`
 * + SQLite     : `SUM(x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 */
export const sumAll : AggregateOperator1<number|null, number|null> = <
    ArgT extends BuiltInExpr_NonAggregate<number|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<number|null, ArgT>
) => {
    return sumImpl(false, arg) as ExprUtil.AggregateIntersect<number|null, ArgT>;
};

/**
 * Returns the total sum of non-`NULL` values from a group.
 *
 * It returns `NULL` if there are no non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_sum
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#sumunc
 *
 * -----
 *
 * + MySQL      : `SUM(x)`
 * + PostgreSQL : `SUM(x)`
 * + SQLite     : `SUM(x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 */
export const sum = sumAll;
