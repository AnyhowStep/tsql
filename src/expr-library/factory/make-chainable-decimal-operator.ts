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
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";

function tryGetFlattenableElements (
    rawExpr : AnyRawExpr,
    operatorType : OperatorType,
    _identityElement : Decimal,
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

    /**
     * We should not see any `Decimal` primitives because JS does not have them.
     */
    //if (rawExpr === identityElement) {
    //    /**
    //     * Eliminate all identity elements
    //     */
    //    return [];
    //}

    return undefined;
}
export type ChainableDecimalOperatorReturn<
    ArrT extends RawExpr<Decimal>[]
> =
    /**
     * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-521819804
     */
    /*
    Expr<{
        mapper : tm.SafeMapper<Decimal>,
        usedRef : RawExprUtil.IntersectUsedRef<ArrT[number]>,
    }>
    */
    TryReuseExistingType<
        ArrT[number],
        Expr<{
            mapper : tm.SafeMapper<Decimal>,
            usedRef : TryReuseExistingType<
                Extract<ArrT[number], IExpr|IExprSelectItem>["usedRef"],
                RawExprUtil.IntersectUsedRef<ArrT[number]>
            >,
        }>
    >
;
export type ChainableDecimalOperator =
    <ArrT extends RawExpr<Decimal>[]> (
        ...arr : ArrT
    ) => (
        ChainableDecimalOperatorReturn<ArrT>
    )
;
export function makeChainableDecimalOperator<
    OperatorTypeT extends OperatorType
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1ToN<OperatorTypeT>,
    rawIdentityElement : string|number|bigint|Decimal,
    mapper : tm.SafeMapper<Decimal>,
    /**
     * For now, the typeHint should always be `DECIMAL`
     */
    typeHint : TypeHint.DECIMAL
) : (
    ChainableDecimalOperator
) {
    const identityElement = tm.mysql.decimal()("rawIdentityElement", rawIdentityElement);
    let identityAst : LiteralValueNode|undefined = undefined;

    const result : ChainableDecimalOperator = <ArrT extends RawExpr<Decimal>[]> (
        ...arr : ArrT
    ) : (
        ChainableDecimalOperatorReturn<ArrT>
    ) => {
        if (identityAst == undefined) {
            const newIdentityAst = LiteralValueNodeUtil.decimalLiteralNode(identityElement, 65, 30);
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
                    operands,
                    typeHint
                )
            )
        ) as ChainableDecimalOperatorReturn<ArrT>;
    };

    return result;
}
