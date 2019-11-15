import {decimalMapper} from "./decimal-mapper";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeOperator2} from "../factory";

/**
 * Treats both arguments as integers and performs integer division
 */
export const integerDiv = makeOperator2<OperatorType.INTEGER_DIVISION, Decimal, Decimal|null>(
    OperatorType.INTEGER_DIVISION,
    decimalMapper.orNull(),
    TypeHint.DECIMAL
);
