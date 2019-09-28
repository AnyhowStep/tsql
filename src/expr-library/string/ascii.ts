import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const ascii = makeOperator1<OperatorType.ASCII, string, bigint>(
    OperatorType.ASCII,
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
