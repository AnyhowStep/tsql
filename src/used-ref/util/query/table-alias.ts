import {IUsedRef} from "../../used-ref";
import {TypeRefOf} from "./type-ref-of";

export type TableAlias<UsedRefT extends IUsedRef> = (
    Extract<keyof TypeRefOf<UsedRefT>, string>
);
