import * as tm from "type-mapping";
import {makeOperator1} from "../factory";
import {OperatorType} from "../../operator-type";
import {EquatableType} from "../../equatable-type";

export const quote = makeOperator1<OperatorType.QUOTE, EquatableType, string>(
    OperatorType.QUOTE,
    tm.string()
);
