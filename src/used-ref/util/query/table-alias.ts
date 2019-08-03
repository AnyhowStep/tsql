import {IUsedRef} from "../../used-ref";
import {TypeRef} from "./type-ref";

export type TableAlias<UsedRefT extends IUsedRef> = (
    Extract<keyof TypeRef<UsedRefT>, string>
);
