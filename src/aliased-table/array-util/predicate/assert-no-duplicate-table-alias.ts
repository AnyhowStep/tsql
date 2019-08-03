import {IAliasedTable} from "../../aliased-table";
import {DuplicateTableAlias, duplicateTableAlias} from "../query";
import {CompileError} from "../../../compile-error";

export type AssertNoDuplicateTableAlias<
    ArrT extends readonly IAliasedTable[]
> = (
    DuplicateTableAlias<ArrT> extends never ?
    unknown :
    CompileError<[
        "Duplicate table alias not allowed",
        DuplicateTableAlias<ArrT>
    ]>
);
export function assertNoDuplicateTableAlias (
    arr : readonly IAliasedTable[]
) {
    const duplicates = duplicateTableAlias(arr);
    if (duplicates.length > 0) {
        throw new Error(`Duplicate table alias not allowed; ${duplicates.join(", ")}`);
    }
}
