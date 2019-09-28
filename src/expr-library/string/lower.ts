import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const lower = makeOperator1<OperatorType.LOWER, string, string>(
    OperatorType.LOWER,
    tm.string(),
    TypeHint.STRING
);
