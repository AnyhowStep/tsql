import {ColumnIdentifierRef} from "../column-identifier-ref";
import {TypeRef} from "../type-ref";

export interface IUsedRef<RefT extends TypeRef=TypeRef> {
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
