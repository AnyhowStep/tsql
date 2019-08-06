import {ColumnIdentifierRef} from "../column-identifier-ref";
import {TypeRef} from "../type-ref";

/**
 * The `never` in the default type argument here is intentional.
 *
 * This will give us,
 * ```ts
 * __contravarianceMarker : (usedRef : never) => void;
 * ```
 *
 * Then, we can assign any other `__contravarianceMarker` to it,
 * ```ts
 * declare const b : (usedRef : { someTable : { someColumn : string } }) => void;
 * __contravarianceMarker = b; //OK!
 * ```
 *
 * `never` is a sub-type of every other type.
 */
export interface IUsedRef<RefT extends TypeRef=never> {
    /**
     * A no-op function during run-time.
     * Is used for contravariant assignability.
     */
    readonly __contravarianceMarker : (usedRef : RefT) => void;

    /**
     * Contains the actual columns used.
     *
     * Will mirror the type of `TypeRefT` during run-time.
     * It will remain `ColumnIdentifierRef` during compile-time.
     */
    readonly columns : ColumnIdentifierRef;
}
