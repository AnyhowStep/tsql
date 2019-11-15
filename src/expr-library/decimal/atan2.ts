import {decimalMapper} from "./decimal-mapper";
import {makeOperator2} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

export const atan2 = makeOperator2<OperatorType.ARC_TANGENT_2, Decimal, Decimal>(
    OperatorType.ARC_TANGENT_2,
    decimalMapper,
    TypeHint.DECIMAL
);
