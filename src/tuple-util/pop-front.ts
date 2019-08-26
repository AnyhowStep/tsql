/**
 * Removes the first element of a tuple and returns the rest of the tuple.
 *
 * ```ts
 * //type Result = [1,2,3,4]
 * type Result = PopFront<[0,1,2,3,4]>
 * ```
 */
export type PopFront<ArrT extends readonly any[]> =
    ((...arr : ArrT) => void) extends ((head : any, ...arr : infer ResultT) => void) ?
    ResultT :
    never
;
