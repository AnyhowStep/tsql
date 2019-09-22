import * as tm from "type-mapping";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {makeUnaryOperator} from "../factory";

export const cos = makeUnaryOperator<OperatorType.COSINE, Decimal, Decimal>(
    OperatorType.COSINE,
    tm.mysql.decimal(),
    TypeHint.DECIMAL
);
