import {TableWithPrimaryKey} from "../../../table";
import {TablePerType} from "../../table-per-type-impl";
import {
    ExtractAutoIncrement,
    ExtractExplicitAutoIncrementValueEnabled,
    ExtractInsertAndFetchPrimaryKey,
    extractAutoIncrement,
    extractExplicitAutoIncrementValueEnabled,
    extractInsertAndFetchPrimaryKey
} from "../query";

export function tablePerType<ChildTableT extends TableWithPrimaryKey> (
    childTable : ChildTableT
) : TablePerType<{
    childTable : ChildTableT,
    parentTables : readonly [],
    autoIncrement : readonly ExtractAutoIncrement<ChildTableT>[],
    explicitAutoIncrementValueEnabled : readonly ExtractExplicitAutoIncrementValueEnabled<ChildTableT>[],
    insertAndFetchPrimaryKey : readonly ExtractInsertAndFetchPrimaryKey<ChildTableT>[],
}> {
    return new TablePerType<{
        childTable : ChildTableT,
        parentTables : readonly [],
        autoIncrement : readonly ExtractAutoIncrement<ChildTableT>[],
        explicitAutoIncrementValueEnabled : readonly ExtractExplicitAutoIncrementValueEnabled<ChildTableT>[],
        insertAndFetchPrimaryKey : readonly ExtractInsertAndFetchPrimaryKey<ChildTableT>[],
    }>(
        {
            childTable,
            parentTables : [],
            autoIncrement : extractAutoIncrement(childTable),
            explicitAutoIncrementValueEnabled : extractExplicitAutoIncrementValueEnabled(childTable),
            insertAndFetchPrimaryKey : extractInsertAndFetchPrimaryKey(childTable),
        },
        [],
    );
}
