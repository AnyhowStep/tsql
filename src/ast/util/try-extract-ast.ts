import {Ast} from "../ast";
import {Parentheses} from "../parentheses";

type TryExtractAstResult<ReturnT extends boolean|Ast|undefined> =
    | (
        ReturnT extends boolean ?
        Ast :
        never
    )
    | Extract<ReturnT, Ast|undefined>
;
/**
 * + If the AST satisfies the predicate, it is returned.
 * + If the AST is a `Parentheses` that contains an AST satisfying the predicate,
 * the `Parentheses` is returned.
 * + Else, `undefined` is returned.
 */
export function tryExtractAst<ReturnT extends boolean|Ast|undefined> (
    operand : Ast,
    extractDelegate : (operand : Ast) => ReturnT
) : TryExtractAstResult<ReturnT> {
    const extractResult = extractDelegate(operand);
    if (extractResult != undefined) {
        if (typeof extractResult == "boolean") {
            //eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (extractResult) {
                return operand as TryExtractAstResult<ReturnT>;
            }
        } else {
            return extractResult as TryExtractAstResult<ReturnT>;
        }
    }

    if (Parentheses.IsParentheses(operand) && operand.canUnwrap) {
        return tryExtractAst(operand.ast, extractDelegate);
    }

    return undefined as TryExtractAstResult<ReturnT>;
}

export function tryExtractAstOr (
    operand : Ast,
    extractDelegate : (operand : Ast) => boolean|Ast|undefined,
    noMatchDelegate : (operand : Ast) => Ast,
) : Ast {
    const extractResult = extractDelegate(operand);
    if (extractResult != undefined) {
        if (typeof extractResult == "boolean") {
            if (extractResult) {
                return operand;
            }
        } else {
            return extractResult;
        }
    }

    if (Parentheses.IsParentheses(operand) && operand.canUnwrap) {
        return tryExtractAstOr(operand.ast, extractDelegate, noMatchDelegate);
    }

    return noMatchDelegate(operand);
}
