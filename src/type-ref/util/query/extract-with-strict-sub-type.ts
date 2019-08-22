import {TypeRef} from "../../type-ref";

/**
 * If the type of a column in `A` is a **strict** subtype of the same column in `B`,
 * it is returned.
 */
export type ExtractWithStrictSubType<
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
                        (
                            A[tableAlias][columnAlias] extends B[tableAlias][columnAlias] ?
                            (
                                B[tableAlias][columnAlias] extends A[tableAlias][columnAlias] ?
                                //The types are the same
                                never :
                                //The types are not the same. The type of the column in `A` is a **strict** subtype.
                                [
                                    tableAlias,
                                    columnAlias,
                                    A[tableAlias][columnAlias],
                                    B[tableAlias][columnAlias]
                                ]
                            ) :
                            never
                        ) :
                        never
                    ) :
                    never
                )
            }[Extract<keyof A[tableAlias], string>]
        )
    }[Extract<keyof A, string>]
;
