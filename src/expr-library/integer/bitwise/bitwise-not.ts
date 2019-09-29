import * as tm from "type-mapping";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";
import {makeOperator1DoubleElimination} from "../../factory";

/**
 * This function has the double elimination property.
 * `~(~(x)) == x`
 */
export const bitwiseNot = makeOperator1DoubleElimination<OperatorType.BITWISE_NOT, bigint, bigint>(
    OperatorType.BITWISE_NOT,
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
