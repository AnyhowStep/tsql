import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {makeOperator1} from "../factory";
import {Decimal} from "../../decimal";

export const cbrt = makeOperator1<OperatorType.CUBE_ROOT, Decimal, Decimal>(
    OperatorType.CUBE_ROOT,
    decimalMapper,
    TypeHint.DECIMAL
);
