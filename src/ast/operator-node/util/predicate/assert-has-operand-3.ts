import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {Operand3} from "../../operand";
import {ExtractStrictSameType} from "../../../../type-util";
import {CompileError} from "../../../../compile-error";

export type AssertHasOperand3<OperatorTypeT extends OperatorType> =
    ExtractStrictSameType<OperatorOperand[OperatorTypeT], Operand3> extends never ?
    CompileError<[
        "Expected binary operator, received",
        OperatorTypeT
    ]> :
    unknown
;
