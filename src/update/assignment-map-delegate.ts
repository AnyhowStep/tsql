import {ITable} from "../table";
import {AssignmentMap_Input} from "./assignment-map";

export type AssignmentMapDelegate<
    TableT extends ITable,
    AssignmentMapT extends AssignmentMap_Input<TableT> = AssignmentMap_Input<TableT>
> =
    (
        columns : TableT["columns"]
    ) => AssignmentMapT
;
