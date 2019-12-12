import {ITable, TableUtil} from "../table";
import {BuiltInExpr_MapCorrelatedOrUndefined} from "../built-in-expr";
import {CustomExpr_MapCorrelatedOrUndefined} from "../custom-expr";

export type CustomAssignmentMap<TableT extends ITable> =
    & {
        readonly [columnAlias in TableT["mutableColumns"][number]]? : (
            CustomExpr_MapCorrelatedOrUndefined<
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

export type BuiltInAssignmentMap<TableT extends ITable> =
    & {
        readonly [columnAlias in TableT["mutableColumns"][number]]? : (
            BuiltInExpr_MapCorrelatedOrUndefined<
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
