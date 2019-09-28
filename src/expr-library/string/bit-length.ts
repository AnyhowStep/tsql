import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const bitLength = makeOperator1<OperatorType.BIT_LENGTH, string, bigint>(
    OperatorType.BIT_LENGTH,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
