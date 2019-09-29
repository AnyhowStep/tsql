import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../../factory";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";

export const bitwiseOr : ChainableOperator<bigint> = makeChainableOperator<OperatorType.BITWISE_OR, bigint>(
    OperatorType.BITWISE_OR,
    tm.BigInt(0),
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
