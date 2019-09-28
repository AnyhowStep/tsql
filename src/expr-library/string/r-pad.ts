import * as tm from "type-mapping";
import {makeOperator3} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const rPad = makeOperator3<OperatorType.RPAD, string, bigint, string, string>(
    OperatorType.RPAD,
    tm.string(),
    TypeHint.STRING
);
