import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

export const pi = makeOperator0<OperatorType.PI, Decimal>(
    OperatorType.PI,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
