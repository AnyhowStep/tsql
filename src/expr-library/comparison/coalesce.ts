import * as tm from "type-mapping";
import {AnyRawExpr, RawExprUtil} from "../../raw-expr";
import {PopFront} from "../../tuple-util";
import {Expr, expr} from "../../expr/expr-impl";
import {ExprUtil} from "../../expr";
import {IExpr} from "../../expr/expr";
import {operatorNode2ToN} from "../../ast/operator-node/util";
import {OperatorType} from "../../operator-type";

/**
 * `COALESCE()` with zero args is just the `NULL` constant.
 */
export type TypeOfCoalesce<ArgsT extends readonly AnyRawExpr[], ResultT extends unknown=null> =
    {
        0 : (
            /**
             * Can't perform fancy computation with a regular array
             */
            RawExprUtil.TypeOf<ArgsT[number]>
        ),
        1 : (
            /**
             * Either the tuple started empty or we have exhausted
             * all elements and not found a non-nullable arg.
             */
            ResultT
        ),
        2 : (
            /**
             * This argument is nullable, keep looking
             */
            TypeOfCoalesce<
                PopFront<ArgsT>,
                (
                    | ResultT
                    | RawExprUtil.TypeOf<ArgsT[0]>
                )
            >
        ),
        3 : (
            /**
             * We have found our non-nullable argument
             */
            RawExprUtil.TypeOf<ArgsT[0]>|Exclude<ResultT, null>
        ),
    }[
        number extends ArgsT["length"] ?
        0 :
        0 extends ArgsT["length"] ?
        1 :
        null extends RawExprUtil.TypeOf<ArgsT[0]> ?
        2 :
        3
    ]
;
export type CoalesceExpr<ArgsT extends readonly AnyRawExpr[]> =
    Expr<{
        mapper : tm.SafeMapper<TypeOfCoalesce<ArgsT>>,
        usedRef : RawExprUtil.IntersectUsedRef<ArgsT[number]>,
    }>
;
/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#function_coalesce
 *
 * `COALESCE()` with zero args is just the `NULL` constant.
 */
export function coalesce<ArgsT extends readonly AnyRawExpr[]> (
    ...args : ArgsT
) : (
    CoalesceExpr<ArgsT>
) {
    const [arg0, arg1, ...argRest] = args;
    if (arg0 === undefined) {
        /**
         * `COALESCE()` with zero args is just the `NULL` constant.
         */
        return ExprUtil.fromRawExpr(null) as IExpr as CoalesceExpr<ArgsT>;
    } else if (arg1 === undefined) {
        /**
         * `COALESCE(x)` is just `x`
         */
        return ExprUtil.fromRawExpr(arg0) as IExpr as CoalesceExpr<ArgsT>;
    } else {
        return expr(
            {
                mapper : tm.unsafeOr(...args.map(RawExprUtil.mapper)),
                usedRef : RawExprUtil.intersectUsedRef(...args),
            },
            operatorNode2ToN(
                OperatorType.COALESCE,
                [
                    RawExprUtil.buildAst(arg0),
                    RawExprUtil.buildAst(arg1),
                    ...argRest.map(RawExprUtil.buildAst)
                ]
            )
        );
    }
}
