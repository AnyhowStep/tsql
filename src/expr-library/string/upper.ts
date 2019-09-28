import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const upper = makeOperator1<OperatorType.UPPER, string, string>(
    OperatorType.UPPER,
    tm.string(),
    TypeHint.STRING
);
