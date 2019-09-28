import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const octetLength = makeOperator1<OperatorType.OCTET_LENGTH, string, bigint>(
    OperatorType.OCTET_LENGTH,
    /**
     * Should not return a value less than zero
     */
    tm.mysql.bigIntUnsigned(),
    TypeHint.STRING
);
