/**
 * This naive implementation works but will quickly give you a max-instantiation-depth error.
 *
 * ```ts
 *  type Reverse<ArrT extends any[], ResultT extends any[]=[]> =
 *      {
 *          //We cannot reverse a non-tuple.
 *          0 : ArrT,
 *          //We are done reversing the tuple.
 *          1 : ResultT,
 *          //We are **not** done reversing the tuple.
 *          //Keep computing recursively.
 *          2 : Reverse<
 *              PopFront<ArrT>,
 *                  PushFront<
 *                  ResultT,
 *                  ArrT[0]
 *              >
 *          >,
 *      }[
 *          number extends ArrT["length"] ?
 *          0 :
 *          ArrT["length"] extends 0 ?
 *          1 :
 *          2
 *      ]
 *  ;
 * ```
 *
 * The below implementation lets us pick an arbitrary depth limit.
 */
import {PopFront} from "./pop-front";
import {PushFront} from "./push-front";
import {MaxDepth, DecrementMaxDepth} from "./trampoline-util";

/**
 * The state of our `Reverse<>` algorithm.
 */
interface Reverse_State {
    /**
     * Are we done computing?
     */
    done : boolean,
    /**
     * The tuple to reverse.
     * Should be an empty tuple if we are `done`.
     */
    arr : readonly any[],
    /**
     * The result.
     * If we are not `done`, it will only contain a **partial** result.
     */
    result : readonly any[]
};

/**
 * Performs `8` iterations of our `Reverse<>` algorithm.
 * It looks a lot like our naive implementation.
 *
 * The difference is that we only do `8` recursive iterations (to prevent going over the max depth).
 * We also return a `Reverse_State`.
 */
type Reverse_Bounce<ArrT extends readonly any[], ResultT extends readonly any[], MaxDepthT extends number=MaxDepth> =
    {
        0 : { done : true, arr : ArrT, result : ArrT },
        1 : { done : true, arr : ArrT, result : ResultT },
        /**
         * We ran out of `MaxDepthT` and haven't completed the computation.
         */
        2 : {
            done : false,
            arr : PopFront<ArrT>,
            result : PushFront<
                ResultT,
                ArrT[0]
            >,
        },
        /**
         * Keep trying to compute the type.
         */
        3 : Reverse_Bounce<
            PopFront<ArrT>,
            PushFront<
                ResultT,
                ArrT[0]
            >,
            DecrementMaxDepth<MaxDepthT>
        >
    }[
        number extends ArrT["length"] ?
        0 :
        ArrT["length"] extends 0 ?
        1 :
        MaxDepthT extends 0 ?
        2 :
        3
    ]
;

/**
 * If we are `done`, we don't need to compute anything else.
 *
 * Performs up to `8` iterations of our `Reverse<>` algorithm.
 */
type Reverse_Bounce1<StateT extends Reverse_State> =
    StateT["done"] extends true ?
    /**
     * Reuse the `StateT` type.
     * Creating fewer unnecessary types is better.
     */
    StateT :
    /**
     * Iterate.
     */
    Reverse_Bounce<StateT["arr"], StateT["result"]>
;

/**
 * Calls `Reverse_Bounce1<>` 8 times.
 *
 * Performs up to `8*8 = 64` iterations of our `Reverse<>` algorithm.
 */
type Reverse_Bounce8<StateT extends Reverse_State> =
    Reverse_Bounce1<StateT> extends infer S0 ?
    (
        Reverse_Bounce1<Extract<S0, Reverse_State>> extends infer S1 ?
        (
            Reverse_Bounce1<Extract<S1, Reverse_State>> extends infer S2 ?
            (
                Reverse_Bounce1<Extract<S2, Reverse_State>> extends infer S3 ?
                (
                    Reverse_Bounce1<Extract<S3, Reverse_State>> extends infer S4 ?
                    (
                        Reverse_Bounce1<Extract<S4, Reverse_State>> extends infer S5 ?
                        (
                            Reverse_Bounce1<Extract<S5, Reverse_State>> extends infer S6 ?
                            (
                                Reverse_Bounce1<Extract<S6, Reverse_State>> extends infer S7 ?
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
 * Calls `Reverse_Bounce8<>` 4 times.
 *
 * So, this supports reversing a tuple less than length `64*4 = 256`
 *
 * There is no real reason why the limit was set to `256`.
 * It could have easily been higher or lower.
 *
 * However, if you are reversing really large tuples while using this
 * library, you must either be writing **really** large SQL queries
 * or are doing something wrong.
 */
type Reverse_Trampoline<ArrT extends readonly any[], ResultT extends readonly any[]> =
    Reverse_Bounce8<{ done : false, arr : ArrT, result : ResultT }> extends infer S0 ?
    (
        Reverse_Bounce8<Extract<S0, Reverse_State>> extends infer S1 ?
        (
            Reverse_Bounce8<Extract<S1, Reverse_State>> extends infer S2 ?
            (
                Reverse_Bounce8<Extract<S2, Reverse_State>> extends infer S3 ?
                (
                    S3
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
 * Reverses a tuple.
 *
 * ```ts
 * //type Result = [4,3,2,1,0]
 * type Result = Reverse<[0,1,2,3,4]>
 * ```
 *
 * This supports reversing a tuple less than length `64*4 = 256`
 *
 * There is no real reason why the limit was set to `256`.
 * It could have easily been higher or lower.
 *
 * However, if you are reversing really large tuples while using this
 * library, you must either be writing **really** large SQL queries
 * or are doing something wrong.
 */
export type Reverse<ArrT extends readonly any[], ResultT extends readonly any[]=[]> =
    Reverse_Trampoline<ArrT, ResultT> extends {
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
