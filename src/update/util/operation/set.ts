import {ITable} from "../../../table";
import {AssignmentMap_Output} from "../../assignment-map";
import {AssignmentMapDelegate} from "../../assignment-map-delegate";
import {cleanAssignmentMap} from "./clean-assignment-map";

export function set<
    TableT extends ITable
> (
    table : TableT,
    assignmentMapDelegate : AssignmentMapDelegate<TableT>
) : AssignmentMap_Output<TableT> {
    const raw = assignmentMapDelegate(table.columns);
    return cleanAssignmentMap(table, raw);
}
