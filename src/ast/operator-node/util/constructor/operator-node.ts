import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {OperatorNode} from "../../operator-node";
import {AssertNonUnion} from "../../../../type-util";
import {TypeHint} from "../../../../type-hint";

export function operatorNode<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & AssertNonUnion<OperatorTypeT>,
    operands : OperatorOperand[OperatorTypeT],
    typeHint : TypeHint|undefined
) : OperatorNode<OperatorTypeT> {
    return {
        type : "Operator",
        operatorType,
        operands,
        typeHint,
    };
}
