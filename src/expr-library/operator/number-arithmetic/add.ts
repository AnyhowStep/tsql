import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../make-chainable-operator";

export const add : ChainableOperator<number> = makeChainableOperator<number>(
    "+",
    0,
    tm.mysql.double()
);
