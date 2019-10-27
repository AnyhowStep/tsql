import {ITable} from "../../../table";
import {AssignmentMap} from "../../assignment-map";
import {AssignmentMapDelegate} from "../../assignment-map-delegate";
import {cleanAssignmentMap} from "./clean-assignment-map";

export function set<
    TableT extends ITable
> (
    table : TableT,
    assignmentMapDelegate : AssignmentMapDelegate<TableT>
) : AssignmentMap<TableT> {
    const raw = assignmentMapDelegate(table.columns);
    return cleanAssignmentMap(table, raw);
}
