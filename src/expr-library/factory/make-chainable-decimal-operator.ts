import * as tm from "type-mapping";
import {RawExpr, RawExprUtil, AnyBuiltInExpr} from "../../raw-expr";
import {ExprUtil} from "../../expr";
import {
    Ast,
    AstArray,
    OperatorNodeUtil,
    AstUtil,
} from "../../ast";
import {OperatorType} from "../../operator-type";
import {LiteralValueNodeUtil, LiteralValueNode} from "../../ast/literal-value-node";
import {BuiltInValueExprUtil} from "../../built-in-value-expr";
import {TypeHint} from "../../type-hint";
import {Decimal} from "../../decimal";
import {decimalMapper} from "../decimal/decimal-mapper";

function tryGetFlattenableElements (
    /**
     * In this specific instance, we could probably have `BuiltInExpr<Decimal>`.
     * Can't accept arbitrary `Decimal` types because they may have invalid precision/scale.
     */
    builtInExpr : AnyBuiltInExpr,
    operatorType : OperatorType,
    _identityElement : Decimal,
    identityAst : LiteralValueNode,
    identityParseResult : tm.FixedPointUtil.ParseResult
) : AstArray|undefined {
    if (ExprUtil.isExpr(builtInExpr)) {
        return AstUtil.tryExtractAst(
            builtInExpr.ast,
            ast => {
                if (LiteralValueNodeUtil.isLiteralValueNode(ast) && BuiltInValueExprUtil.isEqual(ast.literalValue, identityAst.literalValue)) {
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
     * We should not see any `Decimal` built-ins because JS does not have them.
     */
    const builtInExprParseResult = tm.FixedPointUtil.tryParse(String(builtInExpr));
    if (
        builtInExprParseResult != undefined &&
        tm.FixedPointUtil.isEqual(
            builtInExprParseResult,
            identityParseResult,
            tm.FixedPointUtil.ZeroEqualityAlgorithm.NEGATIVE_AND_POSITIVE_ZERO_ARE_EQUAL
        )
    ) {
        /**
         * Eliminate all identity elements
         */
        return [];
    }

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
    ExprUtil.Intersect<Decimal, ArrT[number]>
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
    const identityElement = decimalMapper("rawIdentityElement", rawIdentityElement);
    const identityParseResult = tm.FixedPointUtil.tryParse(rawIdentityElement.toString());
    if (identityParseResult == undefined) {
        throw new Error(`Invalid identity element ${rawIdentityElement}`);
    }
    let identityAst : LiteralValueNode|undefined = undefined;

    const result : ChainableDecimalOperator = <ArrT extends RawExpr<Decimal>[]> (
        ...arr : ArrT
    ) : (
        ExprUtil.Intersect<Decimal, ArrT[number]>
    ) => {
        if (identityAst == undefined) {
            const newIdentityAst = LiteralValueNodeUtil.decimalLiteralNode(identityElement, 65, 30);
            if (!LiteralValueNodeUtil.isLiteralValueNode(newIdentityAst)) {
                throw new Error(`Invalid identity element`);
            }
            identityAst = newIdentityAst;
        }
        let operands : [Ast, ...Ast[]]|undefined = undefined;

        for (const builtInExpr of arr) {
            const flattenableElements = tryGetFlattenableElements(builtInExpr, operatorType, identityElement, identityAst, identityParseResult);
            if (flattenableElements != undefined) {
                /**
                 * Looks like we should flatten this `builtInExpr`
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
                 * Can't flatten this `builtInExpr`
                 */
                if (operands == undefined) {
                    operands = [RawExprUtil.buildAst(builtInExpr)];
                } else {
                    operands.push(RawExprUtil.buildAst(builtInExpr));
                }
            }
        }
        return ExprUtil.intersect<Decimal, ArrT[number]>(
            mapper,
            arr,
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
        );
    };

    return result;
}
