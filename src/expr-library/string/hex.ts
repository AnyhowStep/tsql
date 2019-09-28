import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const hex = makeOperator1<OperatorType.HEX, string, string>(
    OperatorType.HEX,
    tm.string(),
    TypeHint.STRING
);
