import {NonOptionalPartial} from "./non-optional-partial";

export type ReplaceProperty<
    NonGenericT,
    OldT extends NonGenericT,
    NewT extends NonOptionalPartial<NonGenericT>,
    K extends keyof NonGenericT
> = (
    NewT extends Pick<NonGenericT, K> ?
    NewT[K] :
    OldT[K]
);
