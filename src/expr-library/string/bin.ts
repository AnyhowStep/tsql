import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const bin = makeOperator1<OperatorType.BIN, bigint, string>(
    OperatorType.BIN,
    tm.match(/^[01]+$/),
    TypeHint.BIGINT_SIGNED
);
