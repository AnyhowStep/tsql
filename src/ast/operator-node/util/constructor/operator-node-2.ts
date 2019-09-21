import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {OperatorNode} from "../../operator-node";
import {AssertHasOperand2} from "../predicate";
import {Operand2} from "../../operand";
import {TypeHint} from "../../../../type-hint";

export function operatorNode2<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & AssertHasOperand2<OperatorTypeT>,
    operands : Operand2,
    typeHint : TypeHint|undefined
) : OperatorNode<OperatorTypeT> {
    return {
        type : "Operator",
        operatorType,
        operands : operands as OperatorOperand[OperatorTypeT],
        typeHint,
    };
}
