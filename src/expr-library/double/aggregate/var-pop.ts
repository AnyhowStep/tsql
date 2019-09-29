import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator1} from "../../factory";

export const varPop = makeOperator1<OperatorType.AGGREGATE_POPULATION_VARIANCE, number, number|null>(
    OperatorType.AGGREGATE_POPULATION_VARIANCE,
    tm.mysql.double().orNull(),
    TypeHint.DOUBLE
);
