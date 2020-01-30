import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator1} from "../../aggregate-factory";

export const varSamp = makeAggregateOperator1<OperatorType.AGGREGATE_SAMPLE_VARIANCE, number, number|null>(
    OperatorType.AGGREGATE_SAMPLE_VARIANCE,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
