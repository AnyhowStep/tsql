import {OperatorType} from "../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {OperatorNode} from "../../operator-node";
import {AssertNonUnion} from "../../../../type-util";

export function operatorNode<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & AssertNonUnion<OperatorTypeT>,
    operands : OperatorOperand[OperatorTypeT]
) : OperatorNode<OperatorTypeT> {
    return {
        type : "Operator",
        operatorType,
        operands,
    };
}
