import * as tm from "type-mapping";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const position = makeOperator2<OperatorType.POSITION, string, string, bigint>(
    OperatorType.POSITION,
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
