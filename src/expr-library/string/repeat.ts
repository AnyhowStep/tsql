import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const repeat = makeOperator2<OperatorType.REPEAT, string, bigint, string>(
    OperatorType.REPEAT,
    tm.string(),
    TypeHint.STRING
);
