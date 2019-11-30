import {ITable, TableUtil} from "../table";
import {BuiltInExpr_MapCorrelated} from "../built-in-expr";
import {CustomExpr_MapCorrelated} from "../custom-expr";

export type AssignmentMap_Input<TableT extends ITable> =
    & {
        readonly [columnAlias in TableT["mutableColumns"][number]]? : (
            CustomExpr_MapCorrelated<
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
            BuiltInExpr_MapCorrelated<
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
