import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const add : ChainableOperator<number> = makeChainableOperator<OperatorType.ADDITION, number>(
    OperatorType.ADDITION,
    0,
    tm.mysql.double(),
    TypeHint.DOUBLE
);
