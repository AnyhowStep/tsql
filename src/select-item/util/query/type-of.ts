import * as tm from "type-mapping";
import {SingleValueSelectItem} from "../../select-item";

export type TypeOf<ItemT extends SingleValueSelectItem> = (
    tm.OutputOf<ItemT["mapper"]>
);
