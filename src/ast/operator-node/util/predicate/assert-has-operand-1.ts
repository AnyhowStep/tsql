import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {Operand1} from "../../operand";
import {IsStrictSameType} from "../../../../type-util";
import {CompileError} from "../../../../compile-error";

export type AssertHasOperand1<OperatorTypeT extends OperatorType> =
    IsStrictSameType<OperatorOperand[OperatorTypeT], Operand1> extends true ?
    unknown :
    CompileError<[
        "Expected unary operator, received",
        OperatorTypeT
    ]>
;
