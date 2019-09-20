import * as tm from "type-mapping";
import {RawExpr, RawExprUtil, AnyRawExpr} from "../../raw-expr";
import {IExpr, Expr, ExprUtil, expr} from "../../expr";
import {
    Ast,
    AstArray,
    OperatorNodeUtil,
    AstUtil,
} from "../../ast";
import {TryReuseExistingType} from "../../type-util";
import {IExprSelectItem} from "../../expr-select-item";
import {OperatorType} from "../../operator-type";
import {LiteralValueNodeUtil, LiteralValueNode} from "../../ast/literal-value-node";
import {PrimitiveExprUtil} from "../../primitive-expr";

function tryGetFlattenableElements (
    rawExpr : AnyRawExpr,
    operatorType : OperatorType,
    identityElement : null|boolean|number|bigint|string|Buffer,
    identityAst : LiteralValueNode
) : AstArray|undefined {
    if (ExprUtil.isExpr(rawExpr)) {
        return AstUtil.tryExtractAst(
            rawExpr.ast,
            ast => {
                if (LiteralValueNodeUtil.isLiteralValueNode(ast) && PrimitiveExprUtil.isEqual(ast.literalValue, identityAst.literalValue)) {
                    /**
                     * Eliminate all identity elements
                     */
                    return [];
                } else if (OperatorNodeUtil.isOperatorNode(ast) && ast.operatorType == operatorType) {
                    return ast.operands;
                } else {
                    return undefined;
                }
            }
        );
    }

    if (rawExpr === identityElement) {
        /**
         * Eliminate all identity elements
         */
        return [];
    }

    return undefined;
}
export type ChainableOperatorReturn<
    TypeT,
    ArrT extends RawExpr<TypeT>[]
> =
    /**
     * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-521819804
     */
    /*
    Expr<{
        mapper : tm.SafeMapper<TypeT>,
        usedRef : RawExprUtil.IntersectUsedRef<ArrT[number]>,
    }>
    */
    TryReuseExistingType<
        ArrT[number],
        Expr<{
            mapper : tm.SafeMapper<TypeT>,
            usedRef : TryReuseExistingType<
                Extract<ArrT[number], IExpr|IExprSelectItem>["usedRef"],
                RawExprUtil.IntersectUsedRef<ArrT[number]>
            >,
        }>
    >
;
export type ChainableOperator<TypeT extends null|boolean|number|bigint|string|Buffer> =
    <ArrT extends RawExpr<TypeT>[]> (
        ...arr : ArrT
    ) => (
        ChainableOperatorReturn<TypeT, ArrT>
    )
;
export function makeChainableOperator<
    OperatorTypeT extends OperatorType,
    TypeT extends null|boolean|number|bigint|string|Buffer
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1ToN<OperatorTypeT>,
    identityElement : TypeT,
    mapper : tm.SafeMapper<TypeT>
) : (
    ChainableOperator<TypeT>
) {
    let identityAst : LiteralValueNode|undefined = undefined;

    const result : ChainableOperator<TypeT> = <ArrT extends RawExpr<TypeT>[]> (
        ...arr : ArrT
    ) : (
        ChainableOperatorReturn<TypeT, ArrT>
    ) => {
        if (identityAst == undefined) {
            const newIdentityAst = RawExprUtil.buildAst(identityElement);
            if (!LiteralValueNodeUtil.isLiteralValueNode(newIdentityAst)) {
                throw new Error(`Invalid identity element`);
            }
            identityAst = newIdentityAst;
        }
        const usedRef = RawExprUtil.intersectUsedRef(...arr);
        let operands : [Ast, ...Ast[]]|undefined = undefined;

        for (const rawExpr of arr) {
            const flattenableElements = tryGetFlattenableElements(rawExpr, operatorType, identityElement, identityAst);
            if (flattenableElements != undefined) {
                /**
                 * Looks like we should flatten this `rawExpr`
                 */
                if (flattenableElements.length == 0) {
                    continue;
                } else {
                    if (operands == undefined) {
                        operands = [flattenableElements[0], ...flattenableElements.slice(1)];
                    } else {
                        operands.push(...flattenableElements);
                    }
                }
            } else {
                /**
                 * Can't flatten this `rawExpr`
                 */
                if (operands == undefined) {
                    operands = [RawExprUtil.buildAst(rawExpr)];
                } else {
                    operands.push(RawExprUtil.buildAst(rawExpr));
                }
            }
        }
        return expr(
            {
                mapper,
                usedRef,
            },
            (
                (operands == undefined) ?
                /**
                 * By convention, applying the operator to zero operands gives you the identity element
                 */
                identityAst :
                (operands.length == 1) ?
                /**
                 * By convention, applying the operator on one operand does not do anything to the operand
                 */
                operands[0] :
                OperatorNodeUtil.operatorNode1ToN<OperatorTypeT>(
                    operatorType,
                    operands
                )
            )
        ) as ChainableOperatorReturn<TypeT, ArrT>;
    };

    return result;
}
