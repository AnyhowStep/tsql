import * as tm from "type-mapping";
import {ChainableDecimalOperator, makeChainableDecimalOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const sub : ChainableDecimalOperator = makeChainableDecimalOperator<OperatorType.SUBTRACTION>(
    OperatorType.SUBTRACTION,
    0,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
