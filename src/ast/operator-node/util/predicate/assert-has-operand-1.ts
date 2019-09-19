import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {Operand1} from "../../operand";
import {ExtractStrictSameType} from "../../../../type-util";
import {CompileError} from "../../../../compile-error";

export type AssertHasOperand1<OperatorTypeT extends OperatorType> =
    ExtractStrictSameType<OperatorOperand[OperatorTypeT], Operand1> extends never ?
    CompileError<[
        "Expected unary operator, received",
        OperatorTypeT
    ]> :
    unknown
;
