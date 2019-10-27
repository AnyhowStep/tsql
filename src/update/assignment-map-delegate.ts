import {ITable} from "../table";
import {AssignmentMap} from "./assignment-map";

export type AssignmentMapDelegate<
    TableT extends ITable
> =
    (
        columns : TableT["columns"]
    ) => AssignmentMap<TableT>
;
