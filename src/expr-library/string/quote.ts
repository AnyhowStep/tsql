import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {ComparableExpr} from "../../comparable-expr";

export const quote = makeOperator1<OperatorType.QUOTE, ComparableExpr, string>(
    OperatorType.QUOTE,
    tm.string()
);
