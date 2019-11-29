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

function tryGetFlattenableElements (
    builtInExpr : AnyBuiltInExpr,
    operatorType : OperatorType,
    identityElement : null|boolean|number|bigint|string|Uint8Array,
    identityAst : LiteralValueNode
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

    if (
        BuiltInValueExprUtil.isBuiltInValueExpr(builtInExpr) &&
        BuiltInValueExprUtil.isEqual(builtInExpr, identityElement)
    ) {
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
    /*
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
    */
    ExprUtil.Intersect<
        TypeT,
        ArrT[number]
    >
;
export type ChainableOperator<TypeT extends null|boolean|number|bigint|string|Uint8Array> =
    <ArrT extends RawExpr<TypeT>[]> (
        ...arr : ArrT
    ) => (
        ChainableOperatorReturn<TypeT, ArrT>
    )
;
export function makeChainableOperator<
    OperatorTypeT extends OperatorType,
    TypeT extends null|boolean|number|bigint|string|Uint8Array
> (
    operatorType : OperatorTypeT & OperatorNodeUtil.AssertHasOperand1ToN<OperatorTypeT>,
    identityElement : TypeT,
    mapper : tm.SafeMapper<TypeT>,
    typeHint? : TypeHint
) : (
    ChainableOperator<TypeT>
) {
    let identityAst : LiteralValueNode|undefined = undefined;

    const result : ChainableOperator<TypeT> = <ArrT extends RawExpr<TypeT>[]> (
        ...arr : ArrT
    ) : (
        ExprUtil.Intersect<
            TypeT,
            ArrT[number]
        >
    ) => {
        if (identityAst == undefined) {
            const newIdentityAst = RawExprUtil.buildAst(identityElement);
            if (!LiteralValueNodeUtil.isLiteralValueNode(newIdentityAst)) {
                throw new Error(`Invalid identity element`);
            }
            identityAst = newIdentityAst;
        }
        let operands : [Ast, ...Ast[]]|undefined = undefined;

        for (const builtInExpr of arr) {
            const flattenableElements = tryGetFlattenableElements(builtInExpr, operatorType, identityElement, identityAst);
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
        return ExprUtil.intersect<TypeT, ArrT[number]>(
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
        ) as any;
    };

    return result;
}
