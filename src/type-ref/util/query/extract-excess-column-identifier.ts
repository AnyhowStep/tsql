import {TypeRef} from "../../type-ref";

export type ExtractExcessColumnIdentifier<
    A extends TypeRef,
    B extends TypeRef
> =
    {
        [tableAlias in Extract<keyof A, string>] : (
            {
                [columnAlias in Extract<keyof A[tableAlias], string>] : (
                    tableAlias extends keyof B ?
                    (
                        columnAlias extends keyof B[tableAlias] ?
                        never :
                        [tableAlias, columnAlias]
                    ) :
                    [tableAlias, columnAlias]
                )
            }[Extract<keyof A[tableAlias], string>]
        )
    }[Extract<keyof A, string>]
;
