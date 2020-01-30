import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {makeAggregateOperator0} from "../aggregate-factory";

/**
 * https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html#function_count
 *
 * @todo Implement support for `OVER()` clause
 */
export const countAll = makeAggregateOperator0<OperatorType.AGGREGATE_COUNT_ALL, bigint>(
    OperatorType.AGGREGATE_COUNT_ALL,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned()
);
