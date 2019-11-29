import {ITable, TableUtil} from "../table";
import {RawExprUsingColumnMap_Input, RawExprUsingColumnMap_Output} from "../built-in-expr";

export type AssignmentMap_Input<TableT extends ITable> =
    & {
        readonly [columnAlias in TableT["mutableColumns"][number]]? : (
            RawExprUsingColumnMap_Input<
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

export type AssignmentMap_Output<TableT extends ITable> =
    & {
        readonly [columnAlias in TableT["mutableColumns"][number]]? : (
            RawExprUsingColumnMap_Output<
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
