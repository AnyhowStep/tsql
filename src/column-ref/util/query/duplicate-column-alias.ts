import {ColumnRef} from "../../column-ref";
import {ColumnMapUtil} from "../../../column-map";

export type DuplicateColumnAlias<RefT extends ColumnRef> = (
    {
        [tableAlias in Extract<keyof RefT, string>] : (
            Extract<
                /**
                 * Get the `columnAlias` of this `ColumnMap`
                 */
                ColumnMapUtil.ColumnAlias<RefT[tableAlias]>,
                /**
                 * Get the `columnAlias` of all the other `ColumnMap`
                 */
                ColumnMapUtil.ColumnAlias<
                    RefT[Exclude<Extract<keyof RefT, string>, tableAlias>]
                >
            >
        )
    }[Extract<keyof RefT, string>]
);
export function duplicateColumnAlias<RefT extends ColumnRef> (
    ref : RefT
) : (
    DuplicateColumnAlias<RefT>[]
) {
    const duplicateTracker : { [columnAlias:string]:boolean|undefined } = {};
    const result : string[] = [];

    for (const tableAlias of Object.keys(ref)) {
        for (const columnAlias of ColumnMapUtil.columnAlias(ref[tableAlias])) {
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

    return result as DuplicateColumnAlias<RefT>[];
}
