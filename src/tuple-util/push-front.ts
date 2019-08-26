/**
 * Adds an element to the front of the tuple.
 *
 * ```ts
 * //type Result = [0,1,2,3,4]
 * type Result = PushFront<[1,2,3,4], 0>
 * ```
 */
export type PushFront<ArrT extends readonly any[], ElementT> =
    ((element : ElementT, ...arr : ArrT) => void) extends ((...arr : infer ResultT) => void) ?
    ResultT :
    never
;
