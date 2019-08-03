import {IUsedRef} from "../../used-ref";

export type TypeRef<UsedRefT extends IUsedRef> = (
    UsedRefT extends IUsedRef<infer RefT> ?
    RefT :
    never
);
