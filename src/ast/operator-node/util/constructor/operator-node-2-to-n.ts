import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {OperatorNode} from "../../operator-node";
import {AssertHasOperand2ToN} from "../predicate";
import {Operand2ToN} from "../../operand";

export function operatorNode2ToN<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & AssertHasOperand2ToN<OperatorTypeT>,
    operands : Operand2ToN
) : OperatorNode<OperatorTypeT> {
    return {
        type : "Operator",
        operatorType,
        operands : operands as OperatorOperand[OperatorTypeT],
    };
}
