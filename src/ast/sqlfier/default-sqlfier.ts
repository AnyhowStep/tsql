import {Sqlfier} from "./sqlfier";
import {escapeIdentifierWithDoubleQuotes} from "../../sqlstring";
import {OperatorType} from "../../operator-type";
import {functionCall} from "../function-call";
import {OperatorSqlfier} from "./operator-sqlfier";
import {Writable} from "../../type-util";
import {Ast} from "../ast";

const notImplemented = () => {
    throw new Error(`Not implemented`);
};

function insertBetween (operands : readonly Ast[], insertElement : string) : Ast[] {
    const result : Ast[] = [];
    for (const operand of operands) {
        if (result.length > 0) {
            result.push(insertElement);
        }
        result.push(operand);
    }
    return result;
}

export const notImplementedSqlfier : Sqlfier = {
    identifierSqlfier : notImplemented,
    operatorSqlfier : Object
        .values<OperatorType>(OperatorType as unknown as { [k:string] : OperatorType })
        .reduce<Writable<OperatorSqlfier>>(
            (memo, operatorType) => {
                memo[operatorType] = notImplemented;
                return memo;
            },
            {} as Writable<OperatorSqlfier>
        ),
    queryBaseSqlfier : notImplemented,
};
export const defaultSqlfier : Sqlfier = {
    identifierSqlfier : (identifierNode) => identifierNode.identifiers
        .map(escapeIdentifierWithDoubleQuotes)
        .join("."),
    operatorSqlfier : {
        ...notImplementedSqlfier.operatorSqlfier,
        /*
            Comparison Functions and Operators
            https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html
        */
        [OperatorType.BETWEEN_AND] : ({operands}) => [
            operands[0],
            "BETWEEN",
            operands[1],
            "AND",
            operands[2]
        ],
        [OperatorType.COALESCE] : ({operatorType, operands}) => functionCall(operatorType, operands),
        [OperatorType.NOT] : ({operands}) => [
            "NOT",
            operands[0]
        ],

        /*
            Logical Operators
            https://dev.mysql.com/doc/refman/8.0/en/logical-operators.html
        */
        [OperatorType.XOR] : ({operands}) => insertBetween(operands, "XOR"),

        /*
            Arithmetic Operators
            https://dev.mysql.com/doc/refman/8.0/en/arithmetic-functions.html
        */
       [OperatorType.SUBTRACTION] : ({operands}) => insertBetween(operands, "-"),
       [OperatorType.MODULO] : ({operands}) => insertBetween(operands, "%"),
       [OperatorType.ADDITION] : ({operands}) => insertBetween(operands, "+"),

        /*
            Mathematical Functions
            https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html
        */
       [OperatorType.ABSOLUTE_VALUE] : ({operands}) => functionCall("ABS", operands),
       [OperatorType.ARC_COSINE] : ({operands}) => {
           return functionCall("ACOS", operands);
       },
    },
    queryBaseSqlfier : notImplementedSqlfier.queryBaseSqlfier,
}
