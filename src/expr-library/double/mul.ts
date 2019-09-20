import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../factory";
import {OperatorType} from "../../operator-type";

export const mul : ChainableOperator<number> = makeChainableOperator<OperatorType.MULTIPLICATION, number>(
    OperatorType.MULTIPLICATION,
    1,
    tm.mysql.double()
);
