import * as tm from "type-mapping";
import {makeOperator2ToN} from "../factory";
import {OperatorType} from "../../operator-type";
import {TypeHint} from "../../type-hint";

export const concatWs = makeOperator2ToN<OperatorType.CONCAT_WS, string, string|null, string|null, string>(
    OperatorType.CONCAT_WS,
    tm.string(),
    TypeHint.STRING
);
