import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {OperatorNode} from "../../operator-node";
import {AssertHasOperand2} from "../predicate";
import {Operand2} from "../../operand";

export function operatorNode2<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & AssertHasOperand2<OperatorTypeT>,
    operands : Operand2
) : OperatorNode<OperatorTypeT> {
    return {
        type : "Operator",
        operatorType,
        operands : operands as OperatorOperand[OperatorTypeT],
    };
}
