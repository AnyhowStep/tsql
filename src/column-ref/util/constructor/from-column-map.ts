import {WritableColumnRef} from "../../column-ref";
import {ColumnMap} from "../../../column-map";
import {setColumn} from "./from-column";

export function setColumnMap (ref : WritableColumnRef, map : ColumnMap) {
    for (const columnAlias of Object.keys(map)) {
        setColumn(ref, map[columnAlias]);
    }
}
