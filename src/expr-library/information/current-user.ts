import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";

export const currentUser = makeOperator0<OperatorType.CURRENT_USER, string>(
    OperatorType.CURRENT_USER,
    tm.string()
);
