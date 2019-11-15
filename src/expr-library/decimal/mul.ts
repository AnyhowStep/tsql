import {decimalMapper} from "./decimal-mapper";
import {ChainableDecimalOperator, makeChainableDecimalOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const mul : ChainableDecimalOperator = makeChainableDecimalOperator<OperatorType.MULTIPLICATION>(
    OperatorType.MULTIPLICATION,
    1,
    decimalMapper,
    TypeHint.DECIMAL
);
