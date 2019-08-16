/**
 * If `PossiblyUnionT` is a union type,
 * then the result is `never`.
 *
 * If `PossiblyUnionT` is not a union type,
 * then the result is `DistributedT`.
 */
type ExtractNonUnion<DistributedT, PossiblyUnionT> =
    [PossiblyUnionT] extends [DistributedT] ?
    DistributedT :
    never
;
type NonUnionImpl<DistributedT, PossiblyUnionT> =
    DistributedT extends unknown ?
    ExtractNonUnion<DistributedT, PossiblyUnionT> :
    never
;
/**
 * https://github.com/microsoft/TypeScript/issues/32909#issuecomment-521564797
 *
 * When used in a generic type parameter, it ensures the type is not a union type.
 *
 * @todo Test with type inference
 */
export type NonUnion<T> = NonUnionImpl<T,T>;
