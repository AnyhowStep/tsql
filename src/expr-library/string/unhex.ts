import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const unhex = makeOperator1<OperatorType.UNHEX, string, string|null>(
    OperatorType.UNHEX,
    tm.orNull(tm.string()),
    TypeHint.STRING
);
