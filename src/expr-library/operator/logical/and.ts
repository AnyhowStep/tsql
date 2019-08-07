import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../make-chainable-operator";

export const and : ChainableOperator<boolean> = makeChainableOperator<boolean>(
    "AND",
    true,
    tm.mysql.boolean()
);
