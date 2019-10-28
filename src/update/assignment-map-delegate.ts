import {ITable} from "../table";
import {AssignmentMap} from "./assignment-map";

export type AssignmentMapDelegate<
    TableT extends ITable,
    AssignmentMapT extends AssignmentMap<TableT> = AssignmentMap<TableT>
> =
    (
        columns : TableT["columns"]
    ) => AssignmentMapT
;
