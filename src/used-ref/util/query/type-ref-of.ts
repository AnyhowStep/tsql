import {IUsedRef} from "../../used-ref";

/**
 * Named `TypeRefOf<>` to avoid name collision with type `TypeRef`.
 * @todo name other stuff `XxxOf<>` as well?
 */
export type TypeRefOf<UsedRefT extends IUsedRef> = (
    UsedRefT extends IUsedRef<infer RefT> ?
    RefT :
    never
);
