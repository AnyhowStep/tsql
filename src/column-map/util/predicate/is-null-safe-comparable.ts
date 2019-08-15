import * as tm from "type-mapping";
import {ColumnMap} from "../../column-map";
import * as TypeUtil from "../../../type-util";

/**
 * Returns `true` if all columns of `A`
 * are **null-safe** comparable with columns in `B` that have the same name
 *
 * The column aliases of `A` must be a subset of the column aliases of `B`,
 * or the result will never `extends true`
 *
 * + Assumes `A` is not a union
 * + Assumes `B` is not a union
 */
export type IsNullSafeComparable<
    A extends ColumnMap,
    B extends ColumnMap
> = (
    {
        [k in Extract<keyof A, string>] : (
            k extends Extract<keyof B, string> ?
            TypeUtil.IsNullSafeComparable<
                tm.OutputOf<A[k]["mapper"]>,
                tm.OutputOf<B[k]["mapper"]>
            > :
            //`k` is not a columnAlias of `B`
            false
        )
    }[Extract<keyof A, string>]
);


/**
 * Ideally, we'd want to have run-time checks
 * ensuring columns in `a` and columns in `b`
 * have null-safe comparable types.
 *
 * However, due to how the project is structured,
 * this is not possible.
 *
 * So, at the very least, we just check
 * the columns exist.
 */
export function isNullSafeComparable (
    a : ColumnMap,
    b : ColumnMap
) : boolean {
    /**
     * Ideally, we'd want to have run-time checks
     * ensuring columns in `a` and columns in `b`
     * have null-safe comparable types.
     *
     * However, due to how the project is structured,
     * this is not possible.
     *
     * So, at the very least, we just check
     * the columns exist.
     */
    const otherColumnAliases : string[] = Object.keys(b);
    for (const myColumnAlias of Object.keys(a)) {
        if (!otherColumnAliases.includes(myColumnAlias)) {
            /**
             * Other column does not exist
             */
            return false;
        }
    }

    return true;
}
