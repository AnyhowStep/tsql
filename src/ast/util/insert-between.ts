import {Ast} from "../ast";

export function insertBetween (operands : readonly Ast[], insertElement : string) : Ast[] {
    const result : Ast[] = [];
    for (const operand of operands) {
        if (result.length > 0) {
            result.push(insertElement);
        }
        result.push(operand);
    }
    return result;
}
