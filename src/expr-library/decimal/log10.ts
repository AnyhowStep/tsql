import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

/**
 * + MySQL      : `LOG10(0)` === `NULL`
 * + PostgreSQL : `LOG(10, 0)` throws error
 */
export const log10 = makeOperator1<OperatorType.LOG10, Decimal, Decimal|null>(
    OperatorType.LOG10,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);
