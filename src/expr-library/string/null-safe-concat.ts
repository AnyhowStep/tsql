import * as tm from "type-mapping";
import {makeOperator1ToN} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const nullSafeConcat = makeOperator1ToN<OperatorType.NULL_SAFE_CONCAT, string|null, string>(
    OperatorType.NULL_SAFE_CONCAT,
    tm.string(),
    TypeHint.STRING
);
