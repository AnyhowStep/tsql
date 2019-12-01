import {ITable} from "../table";
import {CustomAssignmentMap} from "./assignment-map";

export type AssignmentMapDelegate<
    TableT extends ITable,
    AssignmentMapT extends CustomAssignmentMap<TableT> = CustomAssignmentMap<TableT>
> =
    (
        columns : TableT["columns"]
    ) => AssignmentMapT
;
