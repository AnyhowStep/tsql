import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {Operand1ToN} from "../../operand";
import {IsStrictSameType} from "../../../../type-util";
import {CompileError} from "../../../../compile-error";

export type AssertHasOperand1ToN<OperatorTypeT extends OperatorType> =
    IsStrictSameType<OperatorOperand[OperatorTypeT], Operand1ToN> extends true ?
    unknown :
    CompileError<[
        "Expected 1-to-N operator, received",
        OperatorTypeT
    ]>
;
