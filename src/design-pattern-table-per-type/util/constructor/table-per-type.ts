import {ITable, TableUtil} from "../../../table";
import {TablePerType} from "../../table-per-type-impl";

export function tablePerType<ChildTableT extends ITable> (
    childTable : ChildTableT
) : TablePerType<{
    childTable : ChildTableT,
    parentTables : readonly [],
    autoIncrement : readonly Extract<ChildTableT["autoIncrement"], string>[],
    explicitAutoIncrementValueEnabled : readonly TableUtil.ExplicitAutoIncrement<ChildTableT>[],
}> {
    return new TablePerType<{
        childTable : ChildTableT,
        parentTables : readonly [],
        autoIncrement : readonly Extract<ChildTableT["autoIncrement"], string>[],
        explicitAutoIncrementValueEnabled : readonly TableUtil.ExplicitAutoIncrement<ChildTableT>[],
    }>(
        {
            childTable,
            parentTables : [],
            autoIncrement : (
                childTable.autoIncrement == undefined ?
                [] :
                [childTable.autoIncrement as Extract<ChildTableT["autoIncrement"], string>]
            ),
            explicitAutoIncrementValueEnabled : (
                childTable.autoIncrement == undefined ?
                [] :
                TableUtil.isExplicitAutoIncrement(childTable, childTable.autoIncrement) ?
                [childTable.autoIncrement] :
                []
            ),
        },
        [],
    );
}
