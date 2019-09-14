import {SelectClause} from "../../select-clause";
import {SelectItemUtil, SelectItem} from "../../../select-item";
import {ColumnRef, ColumnRefUtil} from "../../../column-ref";
import {ColumnAliasIgnoreIndex} from "./column-alias-ignore-index";

export type DuplicateColumnAlias<SelectClauseT extends SelectClause> =
    {
        [index in Extract<keyof SelectClauseT, string>] : (
            SelectClauseT[index] extends SelectItem ?
            (
                | Extract<
                    SelectItemUtil.ColumnAlias<SelectClauseT[index]>,
                    ColumnAliasIgnoreIndex<SelectClauseT, index>
                >
                /**
                 * This is needed because the `ColumnRef` may have
                 * duplicate `columnAlias` within itself
                 */
                | (
                    SelectClauseT[index] extends ColumnRef ?
                    ColumnRefUtil.DuplicateColumnAlias<SelectClauseT[index]> :
                    never
                )
            ) :
            never
        )
    }[Extract<keyof SelectClauseT, string>]
;

export function duplicateColumnAlias<
    SelectClauseT extends SelectClause
>(
    selectClause : SelectClause
) : (
    DuplicateColumnAlias<SelectClauseT>[]
) {
    const duplicateTracker : { [columnAlias:string]:boolean|undefined } = {};
    const result : string[] = [];

    for (const item of selectClause) {
        for (const columnAlias of SelectItemUtil.columnAlias(item)) {
            const isDuplicate = duplicateTracker[columnAlias];
            if (isDuplicate === undefined) {
                /**
                 * We had never encountered it, and now we have.
                 * But it isn't a duplicate.
                 */
                duplicateTracker[columnAlias] = false;
            } else if (!isDuplicate) {
                /**
                 * We had encountered it when it wasn't a duplicate.
                 * Now, it is a duplicate.
                 */
                duplicateTracker[columnAlias] = true;
                result.push(columnAlias);
            }
        }

        if (ColumnRefUtil.isColumnRef(item)) {
            for (const columnAlias of ColumnRefUtil.duplicateColumnAlias(item)) {
                const isDuplicate = duplicateTracker[columnAlias];
                if (isDuplicate === undefined) {
                    /**
                     * We had never encountered it, and now we have.
                     * But it isn't a duplicate.
                     */
                    duplicateTracker[columnAlias] = false;
                } else if (!isDuplicate) {
                    /**
                     * We had encountered it when it wasn't a duplicate.
                     * Now, it is a duplicate.
                     */
                    duplicateTracker[columnAlias] = true;
                    result.push(columnAlias);
                }
            }
        }
    }

    return result as DuplicateColumnAlias<SelectClauseT>[];
}
