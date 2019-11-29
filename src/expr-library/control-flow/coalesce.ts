import * as tm from "type-mapping";
import {AnyBuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
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
            BuiltInExprUtil.TypeOf<ArgsT[number]>
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
                    | BuiltInExprUtil.TypeOf<ArgsT[0]>
                )
            >
        ),
        3 : (
            /**
             * We have found our non-nullable argument
             */
            BuiltInExprUtil.TypeOf<ArgsT[0]>|Exclude<ResultT, null>
        ),
    }[
        number extends ArgsT["length"] ?
        0 :
        0 extends ArgsT["length"] ?
        1 :
        null extends BuiltInExprUtil.TypeOf<ArgsT[0]> ?
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
        usedRef : BuiltInExprUtil.IntersectUsedRef<ArgsT[number]>,
    }>
    */
;

export function coalesceMapper<ArgsT extends readonly AnyBuiltInExpr[]> (
    ...args : ArgsT
) : tm.SafeMapper<TypeOfCoalesce<ArgsT>> {

    const builtInExprMapperArr : tm.AnySafeMapper[] = [];
    let lastMapperNonNull = false;
    for (const builtInExpr of args) {
        const builtInExprMapper = BuiltInExprUtil.mapper(builtInExpr);
        builtInExprMapperArr.push(builtInExprMapper);
        if (!tm.canOutputNull(builtInExprMapper)) {
            lastMapperNonNull = true;
            break;
        }
    }
    return (
        lastMapperNonNull ?
        tm.notNull(tm.unsafeOr(...builtInExprMapperArr)) as tm.SafeMapper<any> :
        tm.unsafeOr(...builtInExprMapperArr) as tm.SafeMapper<any>
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
        return ExprUtil.fromBuiltInExpr(null) as IExpr as CoalesceExpr<ArgsT>;
    } else if (arg1 === undefined) {
        /**
         * `COALESCE(x)` is just `x`
         */
        return ExprUtil.fromBuiltInExpr(arg0) as IExpr as CoalesceExpr<ArgsT>;
    } else {
        return ExprUtil.intersect<TypeOfCoalesce<ArgsT>, ArgsT[number]>(
            coalesceMapper(...args),
            args,
            operatorNode2ToN(
                OperatorType.COALESCE,
                [
                    BuiltInExprUtil.buildAst(arg0),
                    BuiltInExprUtil.buildAst(arg1),
                    ...argRest.map(BuiltInExprUtil.buildAst)
                ],
                undefined
            )
        );
    }
}
