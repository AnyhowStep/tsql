import * as tm from "type-mapping";
import {ChainableDecimalOperator, makeChainableDecimalOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const mul : ChainableDecimalOperator = makeChainableDecimalOperator<OperatorType.MULTIPLICATION>(
    OperatorType.MULTIPLICATION,
    1,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
