import * as tm from "type-mapping";
import {BinaryOperator, makeBinaryOperator} from "../make-binary-operator";

export const xor : BinaryOperator<boolean, boolean> = makeBinaryOperator(
    "XOR",
    tm.mysql.boolean()
);
