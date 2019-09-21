import {OperatorType} from "../../operator-type";
import {OperatorOperand} from "./operator-operand";
import {TypeHint} from "../../type-hint";

export interface OperatorNode<OperatorTypeT extends OperatorType=OperatorType> {
    readonly type : "Operator",
    readonly operatorType : OperatorTypeT,
    readonly operands : OperatorOperand[OperatorTypeT],
    /**
     * Necessary because of the following scenario,
     * The AST for computing the `INTEGER_DIVISION` of two numbers will not always be the same.
     *
     * With `DOUBLE` data type,
     * + MySQL      : `(x DIV y) + 0e0`
     * + PostgreSQL : `FLOOR(x / y)`
     * + SQLite     : `FLOOR(x / y)`
     *
     * The AST will look like `{ operatorType : "INTEGER_DIVISION", typeHint : "DOUBLE" }`
     *
     * With `INTEGER` data type,
     * + MySQL      : `x DIV y`
     * + PostgreSQL : `x / y`
     * + SQLite     : `x / y`
     *
     * The AST will look like
     * + `{ operatorType : "INTEGER_DIVISION", typeHint : "BIGINT" }`
     *
     * With `DECIMAL` data type,
     * + MySQL      : `x DIV y`
     * + PostgreSQL : `FLOOR(x / y)`
     * + SQLite     : Does not exist. Maybe implement with custom `DECIMAL_INTERGER_DIVISION(x, y)` function
     *
     * The AST will look like
     * + `{ operatorType : "INTEGER_DIVISION", typeHint : "DECIMAL" }`
     *
     * -----
     *
     */
    readonly typeHint : TypeHint|undefined,
}
