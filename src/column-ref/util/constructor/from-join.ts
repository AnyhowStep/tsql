import {WritableColumnRef} from "../../column-ref";
import {IJoin} from "../../../join";
import {ColumnMapUtil} from "../../../column-map";
import {setColumnMap} from "./from-column-map";

export function setJoin (ref : WritableColumnRef, join : IJoin) {
    setColumnMap(ref, ColumnMapUtil.fromJoin(join));
}
