import * as tm from "type-mapping";
import {makeOperator1ToN} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const concat = makeOperator1ToN<OperatorType.CONCAT, string, string>(
    OperatorType.CONCAT,
    tm.string(),
    TypeHint.STRING
);
