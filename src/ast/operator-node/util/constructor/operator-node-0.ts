import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {OperatorNode} from "../../operator-node";
import {AssertHasOperand0} from "../predicate";
import {Operand0} from "../../operand";
import {TypeHint} from "../../../../type-hint";

export function operatorNode0<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & AssertHasOperand0<OperatorTypeT>,
    typeHint : TypeHint|undefined
) : OperatorNode<OperatorTypeT> {
    return {
        type : "Operator",
        operatorType,
        operands : [] as Operand0 as OperatorOperand[OperatorTypeT],
        typeHint,
    };
}
