import {ITable} from "../../../table";
import {WhereClause} from "../../../where-clause";
import {BuiltInAssignmentMap} from "../../../update";

export interface UpdateResult {
    query : { sql : string },

    //Alias for affectedRows
    foundRowCount : bigint;

    /**
     * You cannot trust this number for SQLite.
     * SQLite thinks that all found rows are updated, even if you set `x = x`.
     *
     * @todo Consider renaming this to `unreliableUpdatedRowCount`?
     */
    //Alias for changedRows
    updatedRowCount : bigint;

    /**
     * May be the duplicate row count, or some other value.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}

export interface Update {
    update<TableT extends ITable> (
        table : TableT,
        whereClause : WhereClause,
        assignmentMap : BuiltInAssignmentMap<TableT>
    ) : Promise<UpdateResult>;
}
