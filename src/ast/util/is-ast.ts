import {Ast} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";
import {OperatorNodeUtil} from "../operator-node";
import {isIdentifierNode} from "../identifier-node";
import {QueryBaseUtil} from "../../query-base";
import {LiteralValueNodeUtil} from "../literal-value-node";
import {CaseValueNodeUtil} from "../case-value-node";
import {CaseConditionNodeUtil} from "../case-condition-node";

/**
 * A type guard for the `Ast` type
 *
 * @param raw
 */
export function isAst (raw : unknown) : raw is Ast {
    if (typeof raw == "string") {
        return true;
    }
    if (Parentheses.IsParentheses(raw)) {
        return true;
    }
    if (FunctionCall.IsFunctionCall(raw)) {
        return true;
    }
    if (OperatorNodeUtil.isOperatorNode(raw)) {
        return true;
    }
    if (isIdentifierNode(raw)) {
        return true;
    }
    if (LiteralValueNodeUtil.isLiteralValueNode(raw)) {
        return true;
    }
    if (Array.isArray(raw)) {
        for (const item of raw) {
            if (!isAst(item)) {
                return false;
            }
        }
        return true;
    }
    if (QueryBaseUtil.isQuery(raw)) {
        return true;
    }
    if (CaseValueNodeUtil.isCaseValueNode(raw)) {
        return true;
    }
    if (CaseConditionNodeUtil.isCaseConditionNode(raw)) {
        return true;
    }
    return false;
}
