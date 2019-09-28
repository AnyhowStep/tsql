import * as tm from "type-mapping";
import {makeOperator3} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const lPad = makeOperator3<OperatorType.LPAD, string, bigint, string, string>(
    OperatorType.LPAD,
    tm.string(),
    TypeHint.STRING
);
