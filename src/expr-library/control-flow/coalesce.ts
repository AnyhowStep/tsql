import * as tm from "type-mapping";
import {AnyBuiltInExpr, RawExprUtil} from "../../raw-expr";
import {PopFront} from "../../tuple-util";
import {ExprUtil} from "../../expr";
import {IExpr} from "../../expr/expr";
import {operatorNode2ToN} from "../../ast/operator-node/util";
import {OperatorType} from "../../operator-type";

/**
 * `COALESCE()` with zero args is just the `NULL` constant.
 */
export type TypeOfCoalesce<ArgsT extends readonly AnyBuiltInExpr[], ResultT extends unknown=null> =
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
export type CoalesceExpr<ArgsT extends readonly AnyBuiltInExpr[]> =
    ExprUtil.Intersect<
        TypeOfCoalesce<ArgsT>,
        ArgsT[number]
    >
    /*
    Expr<{
        mapper : tm.SafeMapper<TypeOfCoalesce<ArgsT>>,
        usedRef : RawExprUtil.IntersectUsedRef<ArgsT[number]>,
    }>
    */
;

export function coalesceMapper<ArgsT extends readonly AnyBuiltInExpr[]> (
    ...args : ArgsT
) : tm.SafeMapper<TypeOfCoalesce<ArgsT>> {

    const rawExprMapperArr : tm.AnySafeMapper[] = [];
    let lastMapperNonNull = false;
    for (const rawExpr of args) {
        const rawExprMapper = RawExprUtil.mapper(rawExpr);
        rawExprMapperArr.push(rawExprMapper);
        if (!tm.canOutputNull(rawExprMapper)) {
            lastMapperNonNull = true;
            break;
        }
    }
    return (
        lastMapperNonNull ?
        tm.notNull(tm.unsafeOr(...rawExprMapperArr)) as tm.SafeMapper<any> :
        tm.unsafeOr(...rawExprMapperArr) as tm.SafeMapper<any>
    );
}

/**
 * https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#function_coalesce
 *
 * `COALESCE()` with zero args is just the `NULL` constant.
 */
export function coalesce<ArgsT extends readonly AnyBuiltInExpr[]> (
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
        return ExprUtil.intersect<TypeOfCoalesce<ArgsT>, ArgsT[number]>(
            coalesceMapper(...args),
            args,
            operatorNode2ToN(
                OperatorType.COALESCE,
                [
                    RawExprUtil.buildAst(arg0),
                    RawExprUtil.buildAst(arg1),
                    ...argRest.map(RawExprUtil.buildAst)
                ],
                undefined
            )
        );
    }
}
