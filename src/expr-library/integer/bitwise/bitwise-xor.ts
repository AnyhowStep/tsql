import * as tm from "type-mapping";
import {makeOperator2} from "../../factory";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";

export const bitwiseXor = makeOperator2<OperatorType.BITWISE_XOR, bigint, bigint>(
    OperatorType.BITWISE_XOR,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
