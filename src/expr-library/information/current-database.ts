import * as tm from "type-mapping";
import {makeOperator0} from "../factory";
import {OperatorType} from "../../operator-type";

export const currentDatabase = makeOperator0<OperatorType.CURRENT_DATABASE, string>(
    OperatorType.CURRENT_DATABASE,
    tm.string()
);
