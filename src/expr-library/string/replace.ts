import * as tm from "type-mapping";
import {makeOperator3} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const replace = makeOperator3<OperatorType.REPLACE, string, string, string, string>(
    OperatorType.REPLACE,
    tm.string(),
    TypeHint.STRING
);
