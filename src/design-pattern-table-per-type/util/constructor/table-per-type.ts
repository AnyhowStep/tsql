import {ITable} from "../../../table";
import {TablePerType} from "../../table-per-type-impl";

export function tablePerType<ChildTableT extends ITable> (
    childTable : ChildTableT
) : TablePerType<{
    childTable : ChildTableT,
    parentTables : readonly [],
}> {
    return new TablePerType(
        {
            childTable,
            parentTables : [],
        },
        [],
    );
}
