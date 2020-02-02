import {ITable} from "../table";
import {CustomAssignmentMap} from "./assignment-map";
import {Identity, AssertSubsetOwnEnumerableKeys} from "../type-util";

export type AssignmentMapDelegate<
    TableT extends Pick<ITable, "columns"|"mutableColumns">,
    AssignmentMapT extends CustomAssignmentMap<TableT>
> =
    Identity<
        (
            columns : TableT["columns"]
        ) => AssignmentMapT & AssertSubsetOwnEnumerableKeys<AssignmentMapT, CustomAssignmentMap<TableT>>
    >
;
