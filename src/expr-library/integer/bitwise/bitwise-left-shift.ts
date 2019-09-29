import * as tm from "type-mapping";
import {makeOperator2} from "../../factory";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";

export const bitwiseLeftShift = makeOperator2<OperatorType.BITWISE_LEFT_SHIFT, bigint, bigint>(
    OperatorType.BITWISE_LEFT_SHIFT,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
