import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../make-chainable-operator";

export const or : ChainableOperator<boolean> = makeChainableOperator<boolean>(
    "OR",
    false,
    tm.mysql.boolean()
);
