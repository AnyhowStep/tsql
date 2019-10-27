import {ITable, TableUtil} from "../table";
import {RawExprUsingColumnMap} from "../raw-expr";

export type AssignmentMap<TableT extends ITable> =
    & {
        readonly [columnAlias in TableT["mutableColumns"][number]]? : (
            RawExprUsingColumnMap<
                TableT["columns"],
                ReturnType<
                    TableT["columns"][columnAlias]["mapper"]
                >
            >
        )
    }
    & {
        readonly [
            columnAlias in Exclude<
                TableUtil.ColumnAlias<TableT>,
                TableT["mutableColumns"][number]
            >
        ]? : undefined
    }
;
