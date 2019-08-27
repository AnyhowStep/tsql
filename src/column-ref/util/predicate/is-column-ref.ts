import {ColumnRef} from "../../column-ref";
import {ColumnMapUtil} from "../../../column-map";

export function isColumnRef (mixed : unknown) : mixed is ColumnRef {
    if (!(mixed instanceof Object)) {
        return false;
    }
    for (const tableAlias of Object.keys(mixed)) {
        const possiblyColumnMap = (mixed as {[k:string]:unknown})[tableAlias];
        if (!ColumnMapUtil.isColumnMap(possiblyColumnMap)) {
            return false;
        }
    }
    return true;
}
