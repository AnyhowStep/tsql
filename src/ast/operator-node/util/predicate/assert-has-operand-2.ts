import {OperatorType} from "../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {Operand2} from "../../operand";
import {IsStrictSameType} from "../../../../type-util";
import {CompileError} from "../../../../compile-error";

export type AssertHasOperand2<OperatorTypeT extends OperatorType> =
    IsStrictSameType<OperatorOperand[OperatorTypeT], Operand2> extends true ?
    unknown :
    CompileError<[
        "Expected binary operator, received",
        OperatorTypeT
    ]>
;
