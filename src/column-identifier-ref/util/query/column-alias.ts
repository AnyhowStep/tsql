import {ColumnIdentifierRef} from "../../column-identifier-ref";
import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";

//Technically, this could be wrong.
//But it shouldn't be wrong, in general.
export type ColumnAlias<RefT extends ColumnIdentifierRef> = (
    RefT extends ColumnIdentifierRef ?
    ColumnIdentifierMapUtil.ColumnAlias<RefT[string]> :
    never
);
