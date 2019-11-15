import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

export const exp = makeOperator1<OperatorType.NATURAL_EXPONENTIATION, Decimal, Decimal>(
    OperatorType.NATURAL_EXPONENTIATION,
    decimalMapper,
    TypeHint.DECIMAL
);
