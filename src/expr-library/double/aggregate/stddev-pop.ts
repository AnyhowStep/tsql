import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeAggregateOperator1} from "../../aggregate-factory";

export const stdDevPop = makeAggregateOperator1<OperatorType.AGGREGATE_POPULATION_STANDARD_DEVIATION, number, number|null>(
    OperatorType.AGGREGATE_POPULATION_STANDARD_DEVIATION,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
