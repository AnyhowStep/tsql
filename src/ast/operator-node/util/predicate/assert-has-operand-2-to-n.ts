import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {Operand2ToN} from "../../operand";
import {ExtractStrictSameType} from "../../../../type-util";
import {CompileError} from "../../../../compile-error";

export type AssertHasOperand2ToN<OperatorTypeT extends OperatorType> =
    ExtractStrictSameType<OperatorOperand[OperatorTypeT], Operand2ToN> extends never ?
    CompileError<[
        "Expected 2-to-N operator, received",
        OperatorTypeT
    ]> :
    unknown
;
