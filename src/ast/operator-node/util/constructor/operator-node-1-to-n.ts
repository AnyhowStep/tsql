import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {OperatorNode} from "../../operator-node";
import {AssertHasOperand1ToN} from "../predicate";
import {Operand1ToN} from "../../operand";

export function operatorNode1ToN<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & AssertHasOperand1ToN<OperatorTypeT>,
    operands : Operand1ToN
) : OperatorNode<OperatorTypeT> {
    return {
        type : "Operator",
        operatorType,
        operands : operands as OperatorOperand[OperatorTypeT],
    };
}
