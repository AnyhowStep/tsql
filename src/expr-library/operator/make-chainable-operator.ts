import * as tm from "type-mapping";
import {RawExpr, RawExprUtil, AnyRawExpr} from "../../raw-expr";
import {Expr, ExprUtil, expr} from "../../expr";
import {Ast, Parentheses, AstArray} from "../../ast";
import {escapeValue} from "../../sqlstring";

function tryGetChainableOperatorAst (
    rawExpr : RawExpr<AnyRawExpr>,
    operatorAst : string,
    identityAst : string
) : AstArray|undefined {
    if (ExprUtil.isExpr(rawExpr)) {
        if (Parentheses.IsParentheses(rawExpr.ast)) {
            const ast = rawExpr.ast.ast;
            if (ast === identityAst) {
                /**
                 * Makes resultant queries "tidier" if we eliminate all identity elements
                 */
                return [];
            }

            if (ast instanceof Array) {
                if (ast.length == 0) {
                    /**
                     * We shouldn't have an array of length zero, in general...
                     */
                    return [];
                }
                if (ast.length == 1 && ast[0] === identityAst) {
                    /**
                     * Makes resultant queries "tidier" if we eliminate all identity elements
                     */
                    return [];
                }
                for (let i=1; i<ast.length; i+=2) {
                    if (ast[i] !== operatorAst) {
                        //This is not the operator we are looking for
                        return undefined;
                    }
                }
                return ast;
            }
        } else if (rawExpr.ast === identityAst) {
            /**
             * Makes resultant queries "tidier" if we eliminate all identity elements
             */
            return [];
        }
    }
    return undefined;
}
export type ChainableOperator<TypeT extends null|boolean|number|bigint|string|Buffer> = (
    <ArrT extends RawExpr<TypeT>[]> (
        ...arr : ArrT
    ) => (
        Expr<{
            mapper : tm.SafeMapper<TypeT>,
            usedRef : RawExprUtil.IntersectUsedRef<ArrT[number]>,
        }>
    )
);
export function makeChainableOperator<TypeT extends null|boolean|number|bigint|string|Buffer> (
    operatorAst : string,
    identityElement : TypeT,
    mapper : tm.SafeMapper<TypeT>
) : (
    ChainableOperator<TypeT>
) {
    const identityAst = escapeValue(identityElement);

    const result : ChainableOperator<TypeT> = <ArrT extends RawExpr<TypeT>[]> (
        ...arr : ArrT
    ) : (
        Expr<{
            mapper : tm.SafeMapper<TypeT>,
            usedRef : RawExprUtil.IntersectUsedRef<ArrT[number]>,
        }>
    ) => {
        const usedRef = RawExprUtil.intersectUsedRef(...arr);
        const ast : Ast[] = [];

        for (const rawExpr of arr) {
            const chainableAst = tryGetChainableOperatorAst(rawExpr, operatorAst, identityAst);
            if (chainableAst != undefined) {
                if (chainableAst.length == 0) {
                    continue;
                } else {
                    if (ast.length > 0) {
                        ast.push(operatorAst);
                    }
                    ast.push(...chainableAst);
                }
            } else {
                /**
                 * Makes resultant queries "tidier" if we eliminate all identity elements
                 */
                if (rawExpr === identityElement) {
                    continue;
                }
                if (ast.length > 0) {
                    ast.push(operatorAst);
                }
                ast.push(RawExprUtil.buildAst(rawExpr));
            }
        }
        if (ast.length == 0) {
            /**
             * By convention, applying the operator to zero operands gives you the identity element
             */
            return expr(
                {
                    mapper,
                    usedRef,
                },
                identityAst
            );
        } else {
            return expr(
                {
                    mapper,
                    usedRef,
                },
                ast
            );
        }
    }

    return result;
}
