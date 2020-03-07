import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1, Operator1} from "../factory";

/**
 * + MySQL      : `LN(0)` === `NULL`
 * + PostgreSQL : `LN(0)` throws error
 */
export const ln : Operator1<Decimal, Decimal|null> = makeOperator1<OperatorType.LN, Decimal, Decimal|null>(
    OperatorType.LN,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);
