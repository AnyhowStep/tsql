import {TypeRef} from "../../type-ref";

export type ExtractTypeMap<
    U extends TypeRef,
    TableAliasT extends string
> = (
    //Extract<U, { [k in TableAliasT] : any }>[TableAliasT]
    U extends TypeRef ?
    (
        TableAliasT extends keyof U ?
        U[TableAliasT] :
        never
    ) :
    never
);
