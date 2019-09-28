import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const trim = makeOperator1<OperatorType.TRIM, string, string>(
    OperatorType.TRIM,
    tm.string(),
    TypeHint.STRING
);
