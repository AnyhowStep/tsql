import * as tm from "type-mapping";
import {makeNullaryOperator} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

export const pi = makeNullaryOperator<OperatorType.PI, Decimal>(
    OperatorType.PI,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
