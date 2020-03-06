import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator2, AggregateOperator1} from "../../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";

const sumAsBigIntSignedImpl = makeAggregateOperator2<OperatorType.AGGREGATE_SUM_AS_BIGINT_SIGNED, boolean, bigint|null, bigint|null>(
    OperatorType.AGGREGATE_SUM_AS_BIGINT_SIGNED,
    tm.mysql.bigIntSigned().orNull(),
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
 * + MySQL      : `CAST(SUM(DISTINCT x) AS SIGNED)`
 *   + Will clamp between min and max bigint signed, instead of throwing on overflow!
 * + PostgreSQL : `SUM(DISTINCT x)`
 *   + Throws on integer overflow
 * + SQLite     : `SUM(DISTINCT x)`
 *   + Throws on integer overflow
 *
 */
export const sumAsBigIntSignedDistinct : AggregateOperator1<bigint|null, bigint|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<bigint|null, ArgT>
) => {
    return sumAsBigIntSignedImpl(true, arg) as ExprUtil.AggregateIntersect<bigint|null, ArgT>;
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
 * + MySQL      : `CAST(SUM(x) AS SIGNED)`
 *   + Will clamp between min and max bigint signed, instead of throwing on overflow!
 * + PostgreSQL : `SUM(x)`
 *   + Throws on integer overflow
 * + SQLite     : `SUM(x)`
 *   + Throws on integer overflow
 *
 */
export const sumAsBigIntSignedAll : AggregateOperator1<bigint|null, bigint|null> = <
    ArgT extends BuiltInExpr_NonAggregate<bigint|null>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<bigint|null, ArgT>
) => {
    return sumAsBigIntSignedImpl(false, arg) as ExprUtil.AggregateIntersect<bigint|null, ArgT>;
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
 * + MySQL      : `CAST(SUM(x) AS SIGNED)`
 *   + Will clamp between min and max bigint signed, instead of throwing on overflow!
 * + PostgreSQL : `SUM(x)`
 *   + Throws on integer overflow
 * + SQLite     : `SUM(x)`
 *   + Throws on integer overflow
 *
 */
export const sumAsBigIntSigned = sumAsBigIntSignedAll;
