import {ColumnRef, ColumnRefUtil} from "../../../column-ref";
import {Writable} from "../../../type-util";
import {ColumnMap} from "../../column-map";

export type FromColumnRef<RefT extends ColumnRef> =
    RefT extends ColumnRef ?
    {
        [columnAlias in ColumnRefUtil.ColumnAlias<RefT>] : (
            ColumnRefUtil.FindWithColumnAlias<
                RefT,
                columnAlias
            >
        )
    } :
    never
;
export function fromColumnRef<
    RefT extends ColumnRef
> (
    ref : RefT
) : (
    FromColumnRef<RefT>
) {
    const result : Writable<ColumnMap> = {};
    for (const tableAlias of Object.keys(ref)) {
        const columnMap = ref[tableAlias];
        for (const columnAlias in columnMap) {
            const column = columnMap[columnAlias];
            result[column.columnAlias] = column;
        }
    }
    return result as FromColumnRef<RefT>;
}
