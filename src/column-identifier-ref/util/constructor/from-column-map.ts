import {ColumnMap, ColumnMapUtil} from "../../../column-map";
import {ColumnIdentifierUtil} from "../../../column-identifier";
import {WritableColumnIdentifierRef} from "../../column-identifier-ref";
import {appendColumn} from "./from-column";

export type FromColumnMap<ColumnMapT extends ColumnMap> = (
    ColumnMapT extends ColumnMap ?
    {
        readonly [tableAlias in ColumnMapUtil.TableAlias<ColumnMapT>] : (
            {
                readonly [columnAlias in ColumnMapUtil.FindWithTableAlias<
                    ColumnMapT,
                    tableAlias
                >["name"]] : (
                    ColumnIdentifierUtil.FromColumn<ColumnMapT[columnAlias]>
                )
            }
        )
    } :
    never
);
export function appendColumnMap (
    ref : WritableColumnIdentifierRef,
    columnMap : ColumnMap
) {
    for (const columnAlias of Object.keys(columnMap)) {
        appendColumn(ref, columnMap[columnAlias]);
    }
    return ref;
}
export function fromColumnMap<ColumnMapT extends ColumnMap> (
    columnMap : ColumnMapT
) : FromColumnMap<ColumnMapT> {
    const result = appendColumnMap({}, columnMap);
    return result as FromColumnMap<ColumnMapT>;
}