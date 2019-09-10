import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {Operand0} from "../../operand";
import {IsStrictSameType} from "../../../../type-util";
import {CompileError} from "../../../../compile-error";

export type AssertHasOperand0<OperatorTypeT extends OperatorType> =
    IsStrictSameType<OperatorOperand[OperatorTypeT], Operand0> extends true ?
    unknown :
    CompileError<[
        "Expected nullary operator, received",
        OperatorTypeT
    ]>
;
