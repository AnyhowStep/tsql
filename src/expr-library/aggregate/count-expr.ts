import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeAggregateOperator2, AggregateOperator1} from "../aggregate-factory";
import {BuiltInExpr_NonAggregate} from "../../built-in-expr";
import {ExprUtil} from "../../expr";

const countExprImpl = makeAggregateOperator2<OperatorType.AGGREGATE_COUNT_EXPR, boolean, unknown, bigint>(
    OperatorType.AGGREGATE_COUNT_EXPR,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned()
);

/**
 * Returns a count of the number of rows with different non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_count
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#count
 *
 * -----
 *
 * + MySQL      : `COUNT(DISTINCT x)`
 * + PostgreSQL : `COUNT(DISTINCT x)`
 * + SQLite     : `COUNT(DISTINCT x)`
 */
export const countExprDistinct : AggregateOperator1<unknown, bigint> = <
    ArgT extends BuiltInExpr_NonAggregate<unknown>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<bigint, ArgT>
) => {
    return countExprImpl(true, arg) as  ExprUtil.AggregateIntersect<bigint, ArgT>;
};

/**
 * Returns a count of the number of rows with non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_count
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#count
 *
 * -----
 *
 * + MySQL      : `COUNT(x)`
 * + PostgreSQL : `COUNT(x)`
 * + SQLite     : `COUNT(x)`
 */
export const countExprAll : AggregateOperator1<unknown, bigint> = <
    ArgT extends BuiltInExpr_NonAggregate<unknown>
>(
    arg : ArgT
) : (
    ExprUtil.AggregateIntersect<bigint, ArgT>
) => {
    return countExprImpl(false, arg) as  ExprUtil.AggregateIntersect<bigint, ArgT>;
};

/**
 * Returns a count of the number of rows with non-`NULL` values.
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_count
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#count
 *
 * -----
 *
 * + MySQL      : `COUNT(x)`
 * + PostgreSQL : `COUNT(x)`
 * + SQLite     : `COUNT(x)`
 */
export const countExpr = countExprAll;
