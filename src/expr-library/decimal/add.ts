import * as tm from "type-mapping";
import {ChainableDecimalOperator, makeChainableDecimalOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const add : ChainableDecimalOperator = makeChainableDecimalOperator<OperatorType.ADDITION>(
    OperatorType.ADDITION,
    0,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
