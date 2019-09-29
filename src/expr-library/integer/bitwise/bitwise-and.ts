import * as tm from "type-mapping";
import {ChainableOperator, makeChainableOperator} from "../../factory";
import {OperatorType} from "../../../operator-type";
import {TypeHint} from "../../../type-hint";

export const bitwiseAnd : ChainableOperator<bigint> = makeChainableOperator<OperatorType.BITWISE_AND, bigint>(
    OperatorType.BITWISE_AND,
    tm.BigInt(-1),
    tm.mysql.bigIntSigned(),
    TypeHint.BIGINT_SIGNED
);
