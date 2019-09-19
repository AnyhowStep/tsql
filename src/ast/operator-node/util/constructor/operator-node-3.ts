import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {OperatorNode} from "../../operator-node";
import {AssertHasOperand3} from "../predicate";
import {Operand3} from "../../operand";

export function operatorNode3<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & AssertHasOperand3<OperatorTypeT>,
    operands : Operand3
) : OperatorNode<OperatorTypeT> {
    return {
        type : "Operator",
        operatorType,
        operands : operands as OperatorOperand[OperatorTypeT],
    };
}
