import {OperatorType} from "../../operator-type";
import {OperatorOperand} from "./operator-operand";

export interface OperatorNode<OperatorTypeT extends OperatorType=OperatorType> {
    readonly type : "Operator",
    readonly operatorType : OperatorTypeT,
    readonly operands : OperatorOperand[OperatorTypeT],
}
