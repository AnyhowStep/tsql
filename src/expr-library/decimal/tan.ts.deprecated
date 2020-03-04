import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator1} from "../factory";

export const tan = makeOperator1<OperatorType.TANGENT, Decimal, Decimal>(
    OperatorType.TANGENT,
    decimalMapper,
    TypeHint.DECIMAL
);
