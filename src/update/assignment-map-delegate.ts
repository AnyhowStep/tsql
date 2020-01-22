import {ITable} from "../table";
import {CustomAssignmentMap} from "./assignment-map";
import {Identity} from "../type-util";

export type AssignmentMapDelegate<
    TableT extends Pick<ITable, "columns"|"mutableColumns">,
    AssignmentMapT extends CustomAssignmentMap<TableT> = CustomAssignmentMap<TableT>
> =
    Identity<
        (
            columns : TableT["columns"]
        ) => AssignmentMapT
    >
;
