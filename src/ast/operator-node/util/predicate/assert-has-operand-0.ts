import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {Operand0} from "../../operand";
import {ExtractStrictSameType} from "../../../../type-util";
import {CompileError} from "../../../../compile-error";

export type AssertHasOperand0<OperatorTypeT extends OperatorType> =
    ExtractStrictSameType<OperatorOperand[OperatorTypeT], Operand0> extends never ?
    CompileError<[
        "Expected nullary operator, received",
        OperatorTypeT
    ]> :
    unknown
;
