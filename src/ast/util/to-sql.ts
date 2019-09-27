import {Ast, AstArray} from "../ast";
import {Parentheses} from "../parentheses";
import {FunctionCall} from "../function-call";
import {OperatorNodeUtil, OperatorNode} from "../operator-node";
import {isIdentifierNode} from "../identifier-node";
import {Sqlfier} from "../sqlfier";
import {QueryBaseUtil} from "../../query-base";
import {LiteralValueNodeUtil, LiteralValueNode} from "../literal-value-node";
import {CaseNodeUtil} from "../case-node";
import {CaseConditionNodeUtil} from "../case-condition-node";

export function toSqlAst (ast : Ast, sqlfier : Sqlfier) : string|AstArray|Parentheses|FunctionCall|LiteralValueNode {
    if (typeof ast == "string") {
        return ast;
    } else if (Parentheses.IsParentheses(ast)) {
        return ast.toSql(sqlfier);
    } else if (FunctionCall.IsFunctionCall(ast)) {
        return ast.toSql(sqlfier);
    } else if (OperatorNodeUtil.isOperatorNode(ast)) {
        return sqlfier.operatorSqlfier[ast.operatorType](
            ast as OperatorNode<never>,
            (ast2 : Ast) => toSql(ast2, sqlfier),
            sqlfier
        );
    } else if (isIdentifierNode(ast)) {
        return sqlfier.identifierSqlfier(ast);
    } else if (QueryBaseUtil.isQuery(ast)) {
        return sqlfier.queryBaseSqlfier(
            ast,
            (ast2 : Ast) => toSql(ast2, sqlfier),
            sqlfier
        );
    } else if (LiteralValueNodeUtil.isLiteralValueNode(ast)) {
        return sqlfier.literalValueSqlfier[ast.literalValueType](
            ast as never,
            (ast2 : Ast) => toSql(ast2, sqlfier),
            sqlfier
        );
    } else if (CaseNodeUtil.isCaseNode(ast)) {
        return sqlfier.caseSqlfier(
            ast,
            (ast2 : Ast) => toSql(ast2, sqlfier),
            sqlfier
        );
    } else if (CaseConditionNodeUtil.isCaseConditionNode(ast)) {
        return sqlfier.caseConditionSqlfier(
            ast,
            (ast2 : Ast) => toSql(ast2, sqlfier),
            sqlfier
        );
    } else {
        return ast.map(subAst => toSql(subAst, sqlfier)).join(" ");
    }
}

/**
 * Converts an AST to a SQL string.
 *
 * **DOES NOT** prettify the output.
 *
 * @see {@link toSqlPretty} for prettified output.
 *
 * @param ast
 */
export function toSql (ast : Ast, sqlfier : Sqlfier) : string {
    const result = toSqlAst(ast, sqlfier);
    if (typeof result == "string") {
        return result;
    } else {
        return toSql(result, sqlfier);
    }
}
