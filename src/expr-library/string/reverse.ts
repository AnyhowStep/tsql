import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const reverse = makeOperator1<OperatorType.REVERSE, string, string>(
    OperatorType.REVERSE,
    tm.string(),
    TypeHint.STRING
);
