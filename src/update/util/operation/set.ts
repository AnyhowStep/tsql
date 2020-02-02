import {ITable} from "../../../table";
import {BuiltInAssignmentMap, CustomAssignmentMap} from "../../assignment-map";
import {AssignmentMapDelegate} from "../../assignment-map-delegate";
import {cleanAssignmentMap} from "./clean-assignment-map";

export function set<
    TableT extends ITable,
    AssignmentMapT extends CustomAssignmentMap<TableT>
> (
    table : TableT,
    assignmentMapDelegate : AssignmentMapDelegate<TableT, AssignmentMapT>
) : BuiltInAssignmentMap<TableT> {
    const raw = assignmentMapDelegate(table.columns);
    return cleanAssignmentMap(table, raw);
}
