/**
 * This type is a workaround for TypeScript's lack of a native "compile error" type.
 *
 * For motivation behind this,
 * https://github.com/microsoft/TypeScript/issues/23689#issuecomment-512114782
 *
 * -----
 *
 * We should never be able to create a value of this type legitimately.
 *
 * `_ErrorMessageT` is our error message
 *
 * -----
 *
 * This workaround should only ever be used in function parameter lists.
 *
 */
export interface CompileError<_ErrorMessageT> {
    /**
     * There should never be a value of this type
     */
    readonly __compileError : never;
}
