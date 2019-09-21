import {OperatorType} from "../../../../operator-type";
import {OperatorOperand} from "../../operator-operand";
import {OperatorNode} from "../../operator-node";
import {AssertHasOperand1ToN} from "../predicate";
import {Operand1ToN} from "../../operand";
import {TypeHint} from "../../../../type-hint";

export function operatorNode1ToN<OperatorTypeT extends OperatorType> (
    operatorType : OperatorTypeT & AssertHasOperand1ToN<OperatorTypeT>,
    operands : Operand1ToN,
    typeHint : TypeHint|undefined
) : OperatorNode<OperatorTypeT> {
    return {
        type : "Operator",
        operatorType,
        operands : operands as OperatorOperand[OperatorTypeT],
        typeHint,
    };
}
