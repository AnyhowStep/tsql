import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

export const random = makeOperator0<OperatorType.RANDOM, Decimal>(
    OperatorType.RANDOM,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
