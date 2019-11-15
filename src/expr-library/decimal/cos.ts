import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

export const cos = makeOperator1<OperatorType.COSINE, Decimal, Decimal>(
    OperatorType.COSINE,
    decimalMapper,
    TypeHint.DECIMAL
);
