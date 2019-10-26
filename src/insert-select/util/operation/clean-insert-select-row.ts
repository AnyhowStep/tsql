import {ITable, TableUtil} from "../../../table";
import {InsertSelectRow} from "../../insert-select-row";
import {QueryBaseUtil} from "../../../query-base";
import {cleanInsertSelectColumn} from "./clean-insert-select-column";
import {ColumnRefUtil} from "../../../column-ref";

/**
 * + Removes excess properties.
 * + Removes properties with value `undefined`.
 * + Checks required properties are there.
 */
export function cleanInsertSelectRow<
    QueryT extends QueryBaseUtil.AfterSelectClause,
    TableT extends ITable
> (
    query : QueryT,
    table : TableT,
    row : InsertSelectRow<QueryT, TableT>
) : InsertSelectRow<QueryT, TableT> {
    const allowedColumnRef = ColumnRefUtil.fromSelectClause<QueryT["selectClause"]>(
        query.selectClause
    );

    const result = {} as InsertSelectRow<QueryT, TableT>;
    for (const requiredColumnAlias of TableUtil.requiredColumnAlias(table)) {
        result[requiredColumnAlias] = cleanInsertSelectColumn<QueryT, TableT>(
            allowedColumnRef,
            table,
            row,
            requiredColumnAlias,
            true
        ) as any;
    }

    for (const optionalColumnAlias of TableUtil.optionalColumnAlias(table)) {
        const value = cleanInsertSelectColumn<QueryT, TableT>(
            allowedColumnRef,
            table,
            row,
            optionalColumnAlias,
            false
        );
        if (value === undefined) {
            continue;
        }
        result[optionalColumnAlias] = value as any;
    }

    return result;
}
