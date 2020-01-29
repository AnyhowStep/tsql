import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator1} from "../../aggregate-factory";

export const stdDevSamp = makeAggregateOperator1<OperatorType.AGGREGATE_SAMPLE_STANDARD_DEVIATION, number, number|null>(
    OperatorType.AGGREGATE_SAMPLE_STANDARD_DEVIATION,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
