import {IUsedRef} from "../../used-ref";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {ColumnIdentifierArrayUtil} from "../../../column-identifier";
import {TypeRef, TypeRefUtil} from "../../../type-ref";
import {TypeRefOf} from "../query";
import {CompileError} from "../../../compile-error";

type ExtractedStrictSubTypeToCompileError<
    T extends [string, string, any, any]
> = (
    T extends [string, string, any, any] ?
    CompileError<[
        "expected to handle",
        T[0],
        T[1],
        T[3],
        "actually handles",
        T[2]
    ]> :
    never
);
/**
 * Checks if `AllowedT` is assignable to `UsedT`
 */
export type AssertAllowedImpl<
    AllowedT extends TypeRef,
    UsedT extends TypeRef
> = (
    TypeRefUtil.ExtractExcessColumnIdentifier<UsedT, AllowedT> extends never ?
    (
        TypeRefUtil.ExtractWithStrictSubType<UsedT, AllowedT> extends never ?
        unknown :
        ExtractedStrictSubTypeToCompileError<
            TypeRefUtil.ExtractWithStrictSubType<UsedT, AllowedT>
        >
    ) :
    CompileError<[
        "The following columns cannot be referenced",
        TypeRefUtil.ExtractExcessColumnIdentifier<UsedT, AllowedT>
    ]>
);
export type AssertAllowed<
    AllowedT extends IUsedRef,
    UsedT extends IUsedRef
> = (
    AssertAllowedImpl<
        TypeRefOf<AllowedT>,
        TypeRefOf<UsedT>
    >
);
/**
 * @todo Better naming
 *
 * @param allowed - Which references are allowed
 * @param used - Which references were actually used
 */
export function assertAllowed (
    allowed : Pick<IUsedRef, "columns">,
    used : Pick<IUsedRef, "columns">
) {
    ColumnIdentifierRefUtil.assertHasColumnIdentifiers(
        allowed.columns,
        ColumnIdentifierArrayUtil.fromColumnRef(used.columns)
    );
}
