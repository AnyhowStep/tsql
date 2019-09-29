import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator1} from "../../factory";

export const stdDevPop = makeOperator1<OperatorType.AGGREGATE_POPULATION_STANDARD_DEVIATION, number, number|null>(
    OperatorType.AGGREGATE_POPULATION_STANDARD_DEVIATION,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
