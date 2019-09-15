import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../factory";
import {OperatorType} from "../../operator-type";

export const sub : ChainableOperator<number> = makeChainableOperator<OperatorType.SUBTRACTION, number>(
    OperatorType.SUBTRACTION,
    0,
    tm.mysql.double()
);
