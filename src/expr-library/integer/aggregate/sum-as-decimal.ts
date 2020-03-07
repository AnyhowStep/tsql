import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {Decimal} from "../../../decimal";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {decimalMapper} from "../../decimal/decimal-mapper";

/**
 * The return type being `DECIMAL` is intentional.
 */
const sumAsDecimalImpl : AggregateOperator2<boolean, bigint|null, Decimal|null> = makeAggregateOperator2<OperatorType.AGGREGATE_SUM_AS_DECIMAL, boolean, bigint|null, Decimal|null>(
    OperatorType.AGGREGATE_SUM_AS_DECIMAL,
    decimalMapper.orNull(),
    TypeHint.BIGINT_SIGNED
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
 * + PostgreSQL : `SUM(DISTINCT CAST(x AS NUMERIC))`
 * + SQLite     : `SUM(DISTINCT CAST(x AS NUMERIC))`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 *
 * @todo Some kind of `DECIMAL` polyfill for SQLite.
 */
export const sumAsDecimalDistinct : AggregateOperator1<bigint|null, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return sumAsDecimalImpl(true, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
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
 * + PostgreSQL : `SUM(CAST(x AS NUMERIC))`
 * + SQLite     : `SUM(CAST(x AS NUMERIC))`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 *
 * @todo Some kind of `DECIMAL` polyfill for SQLite.
 */
export const sumAsDecimalAll : AggregateOperator1<bigint|null, Decimal|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<Decimal|null, ArgT>
) => {
    return sumAsDecimalImpl(false, arg) as ExprUtil.AggregateIntersect<Decimal|null, ArgT>;
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
 * + PostgreSQL : `SUM(CAST(x AS NUMERIC))`
 * + SQLite     : `SUM(CAST(x AS NUMERIC))`
 *
 * -----
 *
 * No guarantees are made about the precision of the return type.
 *
 * @todo Some kind of `DECIMAL` polyfill for SQLite.
 */
export const sumAsDecimal = sumAsDecimalAll;
