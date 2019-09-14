import {ColumnRef} from "../../column-ref";
import {ColumnMapUtil} from "../../../column-map";

export type ColumnAlias<RefT extends ColumnRef> = (
    RefT extends ColumnRef ?
    {
        [tableAlias in Extract<keyof RefT, string>] : (
            ColumnMapUtil.ColumnAlias<RefT[tableAlias]>
        )
    }[Extract<keyof RefT, string>] :
    never
);
export function columnAlias<RefT extends ColumnRef> (
    ref : RefT
) : ColumnAlias<RefT>[] {
    const result : string[] = [];
    for (const tableAlias of Object.keys(ref)) {
        result.push(...ColumnMapUtil.columnAlias(ref[tableAlias]));
    }
    return result as ColumnAlias<RefT>[];
}
