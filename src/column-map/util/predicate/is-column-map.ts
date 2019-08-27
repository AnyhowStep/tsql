import {ColumnMap} from "../../column-map";
import {ColumnUtil} from "../../../column";

export function isColumnMap (mixed : unknown) : mixed is ColumnMap {
    if (!(mixed instanceof Object)) {
        return false;
    }
    for (const columnAlias of Object.keys(mixed)) {
        const possiblyColumn = (mixed as {[k:string]:unknown})[columnAlias];
        if (!ColumnUtil.isColumn(possiblyColumn)) {
            return false;
        }
    }
    return true;
}
