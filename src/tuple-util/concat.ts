/**
 * This naive implementation works.
 * @todo Debate implementation details.
 * Are there cases where this naive implementation fails?
 *
 * ```ts
 *  type Concat<ArrT extends any[], OtherT extends any[]> =
 *      Reverse<
 *          Reverse<ArrT>,
 *          OtherT
 *      >
 *  ;
 * ```
 */
import {Reverse} from "./reverse";

/*
type Concat<ArrT extends any[], OtherT extends any[]> =
    Reverse2<ArrT> extends infer X ?
    (
        X extends never ?
        never :
        Reverse2<
            Extract<X, any[]>,
            OtherT
        > extends infer X ? Extract<X, (ArrT[number]|OtherT[number])[]> : never
    ) :
    never
;
*/
/**
 * Concatenates two tuples.
 *
 * ```ts
 *  //type Result = [0,1,2,3,4,5,6,7,8,9]
 *  type Result = Concat<[0,1,2,3,4], [5,6,7,8,9]>
 * ```
 */
export type Concat<ArrT extends readonly any[], OtherT extends readonly any[]> =
    Reverse<
        Reverse<ArrT>,
        OtherT
    >
;
