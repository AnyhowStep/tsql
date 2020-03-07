import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeAggregateOperator0, AggregateOperator0} from "../aggregate-factory";

/**
 * Returns a count of the number of rows
 *
 * + https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_count
 * + https://www.postgresql.org/docs/9.2/functions-aggregate.html#FUNCTIONS-AGGREGATE-TABLE
 * + https://www.sqlite.org/lang_aggfunc.html#count
 *
 * -----
 *
 * + MySQL      : `COUNT(*)`
 * + PostgreSQL : `COUNT(*)`
 * + SQLite     : `COUNT(*)`
 *
 * @todo Rename to `count`? or `countRow`?
 * @todo Or add a function `count()` with overloads for `countExpr` and `countAll`?
 */
export const countAll : AggregateOperator0<bigint> = makeAggregateOperator0<OperatorType.AGGREGATE_COUNT_ALL, bigint>(
    OperatorType.AGGREGATE_COUNT_ALL,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned()
);
