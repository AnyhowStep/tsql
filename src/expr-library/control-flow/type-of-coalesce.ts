import {AnyBuiltInExpr, BuiltInExprUtil} from "../../built-in-expr";
import {PopFront} from "../../tuple-util";

// /**
//  * `COALESCE()` with zero args is just the `NULL` constant.
//  */
// export type TypeOfCoalesceDeprecated<ArgsT extends readonly AnyBuiltInExpr[], ResultT extends unknown=null> =
//     {
//         0 : (
//             /**
//              * Can't perform fancy computation with a regular array
//              */
//             BuiltInExprUtil.TypeOf<ArgsT[number]>
//         ),
//         1 : (
//             /**
//              * Either the tuple started empty or we have exhausted
//              * all elements and not found a non-nullable arg.
//              */
//             ResultT
//         ),
//         2 : (
//             /**
//              * This argument is nullable, keep looking
//              */
//             TypeOfCoalesceDeprecated<
//                 PopFront<ArgsT>,
//                 (
//                     | ResultT
//                     | BuiltInExprUtil.TypeOf<ArgsT[0]>
//                 )
//             >
//         ),
//         3 : (
//             /**
//              * We have found our non-nullable argument
//              */
//             BuiltInExprUtil.TypeOf<ArgsT[0]>|Exclude<ResultT, null>
//         ),
//     }[
//         number extends ArgsT["length"] ?
//         0 :
//         0 extends ArgsT["length"] ?
//         1 :
//         null extends BuiltInExprUtil.TypeOf<ArgsT[0]> ?
//         2 :
//         3
//     ]
// ;

import {MaxDepth, DecrementMaxDepth} from "../../tuple-util/trampoline-util";

/**
 * The state of our `TypeOfCoalesce<>` algorithm.
 */
interface TypeOfCoalesce_State {
    /**
     * Are we done computing?
     */
    done : boolean,
    /**
     * The tuple to coalesce.
     * Should be an empty tuple if we are `done`.
     */
    arr : readonly AnyBuiltInExpr[],
    /**
     * The result.
     * If we are not `done`, it will only contain a **partial** result.
     */
    result : unknown,
};

/**
 * Performs `8` iterations of our `TypeOfCoalesce<>` algorithm.
 * It looks a lot like our naive implementation.
 *
 * The difference is that we only do `8` recursive iterations (to prevent going over the max depth).
 * We also return a `TypeOfCoalesce_State`.
 */
type TypeOfCoalesce_Bounce<
    ArrT extends readonly AnyBuiltInExpr[],
    ResultT extends unknown,
    MaxDepthT extends number=MaxDepth
> =
    {
        /**
         * Can't perform fancy computation with a regular array
         */
        0 : { done : true, arr : ArrT, result : BuiltInExprUtil.TypeOf<ArrT[number]> },
        /**
         * Either the tuple started empty or we have exhausted
         * all elements and not found a non-nullable arg.
         */
        1 : { done : true, arr : ArrT, result : ResultT },
        /**
         * We ran out of `MaxDepthT` and haven't completed the computation.
         */
        2 : {
            done : false,
            arr : PopFront<ArrT>,
            result : (
                | ResultT
                | BuiltInExprUtil.TypeOf<ArrT[0]>
            ),
        },
        /**
         * Keep trying to compute the type.
         */
        /**
         * This argument is nullable, keep looking
         */
        3 : TypeOfCoalesce_Bounce<
            PopFront<ArrT>,
            (
                | ResultT
                | BuiltInExprUtil.TypeOf<ArrT[0]>
            ),
            DecrementMaxDepth<MaxDepthT>
        >,
        /**
         * Keep trying to compute the type.
         */
        /**
         * We have found our non-nullable argument
         */
        4 : { done : true, arr : ArrT, result : BuiltInExprUtil.TypeOf<ArrT[0]>|Exclude<ResultT, null> }
    }[
        number extends ArrT["length"] ?
        0 :
        ArrT["length"] extends 0 ?
        1 :
        MaxDepthT extends 0 ?
        2 :
        null extends BuiltInExprUtil.TypeOf<ArrT[0]> ?
        3 :
        4
    ]
;

/**
 * If we are `done`, we don't need to compute anything else.
 *
 * Performs up to `8` iterations of our `TypeOfCoalesce<>` algorithm.
 */
type TypeOfCoalesce_Bounce1<StateT extends TypeOfCoalesce_State> =
    StateT["done"] extends true ?
    /**
     * Reuse the `StateT` type.
     * Creating fewer unnecessary types is better.
     */
    StateT :
    /**
     * Iterate.
     */
    TypeOfCoalesce_Bounce<StateT["arr"], StateT["result"]>
;

/**
 * Calls `TypeOfCoalesce_Bounce1<>` 8 times.
 *
 * So, this supports coalescing a tuple less than length `8*8 = 64`
 *
 * There is no real reason why the limit was set to `64`.
 * It could have easily been higher or lower.
 *
 * However, if you are coalescing really large tuples while using this
 * library, you must either be writing **really** large SQL queries
 * or are doing something wrong.
 */
type TypeOfCoalesce_Trampoline<ArrT extends readonly AnyBuiltInExpr[], ResultT extends unknown> =
    TypeOfCoalesce_Bounce1<{ done : false, arr : ArrT, result : ResultT }> extends infer S0 ?
    (
        TypeOfCoalesce_Bounce1<Extract<S0, TypeOfCoalesce_State>> extends infer S1 ?
        (
            TypeOfCoalesce_Bounce1<Extract<S1, TypeOfCoalesce_State>> extends infer S2 ?
            (
                TypeOfCoalesce_Bounce1<Extract<S2, TypeOfCoalesce_State>> extends infer S3 ?
                (
                    TypeOfCoalesce_Bounce1<Extract<S3, TypeOfCoalesce_State>> extends infer S4 ?
                    (
                        TypeOfCoalesce_Bounce1<Extract<S4, TypeOfCoalesce_State>> extends infer S5 ?
                        (
                            TypeOfCoalesce_Bounce1<Extract<S5, TypeOfCoalesce_State>> extends infer S6 ?
                            (
                                TypeOfCoalesce_Bounce1<Extract<S6, TypeOfCoalesce_State>> extends infer S7 ?
                                (
                                    S7
                                ) :
                                never
                            ) :
                            never
                        ) :
                        never
                    ) :
                    never
                ) :
                never
            ) :
            never
        ) :
        never
    ):
    never
;

/**
 * `COALESCE()` with zero args is just the `NULL` constant.
 */
/**
 * Coalesces a tuple.
 *
 * ```ts
 * //type Result = 1|2|3
 * type Result = TypeOfCoalesce<[1|null, 2|null, 3, 4, 5|null, 6]>
 * ```
 *
 * This supports coalescing a tuple less than length `8*8 = 64`
 *
 * There is no real reason why the limit was set to `64`.
 * It could have easily been higher or lower.
 *
 * However, if you are coalescing really large tuples while using this
 * library, you must either be writing **really** large SQL queries
 * or are doing something wrong.
 */
export type TypeOfCoalesce<ArrT extends readonly AnyBuiltInExpr[], ResultT extends unknown=null> =
    TypeOfCoalesce_Trampoline<ArrT, ResultT> extends {
        done : infer DoneT,
        result : infer R,
    } ?
    (
        DoneT extends true ?
        R :
        never
    ) :
    never
;
