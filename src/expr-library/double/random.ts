import * as tm from "type-mapping";
import {makeNullaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";

export const random = makeNullaryOperator<OperatorType.RANDOM, number>(
    OperatorType.RANDOM,
    tm.mysql.double()
);
