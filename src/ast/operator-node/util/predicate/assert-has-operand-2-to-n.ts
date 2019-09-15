import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {Operand2ToN} from "../../operand";
import {IsStrictSameType} from "../../../../type-util";
import {CompileError} from "../../../../compile-error";

export type AssertHasOperand2ToN<OperatorTypeT extends OperatorType> =
    IsStrictSameType<OperatorOperand[OperatorTypeT], Operand2ToN> extends true ?
    unknown :
    CompileError<[
        "Expected 2-to-N operator, received",
        OperatorTypeT
    ]>
;
