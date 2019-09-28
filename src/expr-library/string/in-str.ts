import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const inStr = makeOperator2<OperatorType.IN_STR, string, string, bigint>(
    OperatorType.IN_STR,
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
