import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {Decimal} from "../../../decimal";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {decimalMapper} from "../../decimal/decimal-mapper";

/**
 * The return type being `DECIMAL` is intentional.
 */
const avgImpl = makeAggregateOperator2<OperatorType.AGGREGATE_AVERAGE, boolean, bigint|null, Decimal|null>(
    OperatorType.AGGREGATE_AVERAGE,
    decimalMapper.orNull(),
    TypeHint.BIGINT_SIGNED
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
 * + MySQL tends to return fewer decimal places.
 * + PostgreSQL tends to return more decimal places.
 * + SQLite uses double precision arithmetic, rather than fixed precision.
 *
 * @todo Some kind of `DECIMAL` polyfill for SQLite.
 */
export const avgDistinct : AggregateOperator1<bigint|null, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return avgImpl(true, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
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
 * + MySQL      : `AVG(DISTINCT x)`
 * + PostgreSQL : `AVG(DISTINCT x)`
 * + SQLite     : `AVG(DISTINCT x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 * + MySQL tends to return fewer decimal places.
 * + PostgreSQL tends to return more decimal places.
 * + SQLite uses double precision arithmetic, rather than fixed precision.
 *
 * @todo Some kind of `DECIMAL` polyfill for SQLite.
 */
export const avgAll : AggregateOperator1<bigint|null, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return avgImpl(false, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
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
 * + MySQL      : `AVG(DISTINCT x)`
 * + PostgreSQL : `AVG(DISTINCT x)`
 * + SQLite     : `AVG(DISTINCT x)`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 * + MySQL tends to return fewer decimal places.
 * + PostgreSQL tends to return more decimal places.
 * + SQLite uses double precision arithmetic, rather than fixed precision.
 *
 * @todo Some kind of `DECIMAL` polyfill for SQLite.
 */
export const avg = avgAll;
