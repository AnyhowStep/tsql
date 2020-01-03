import {DeletableTable} from "../../../table";
import {WhereClause} from "../../../where-clause";

export interface DeleteResult {
    query : { sql : string },

    //Alias for affectedRows
    deletedRowCount : bigint;

    /**
     * @todo MySQL sometimes gives a `warningCount` value `> 0` for
     * `DELETE` statements. Recall why.
     */
    warningCount : bigint;
    /**
     * An arbitrary message.
     * May be an empty string.
     */
    message : string;
}

export interface Delete {
    delete (
        table : DeletableTable,
        whereClause : WhereClause
    ) : Promise<DeleteResult>;
}
