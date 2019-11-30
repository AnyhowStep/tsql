import {ITable} from "../../../table";
import {AssignmentMap_Input, AssignmentMap_Output} from "../../assignment-map";
import {UsedRefUtil} from "../../../used-ref";
import {BuiltInExprUtil} from "../../../built-in-expr";

export function cleanAssignmentMap<
    TableT extends ITable
> (
    table : TableT,
    raw : AssignmentMap_Input<TableT>
) : AssignmentMap_Output<TableT> {
    const result = {} as AssignmentMap_Output<TableT>;

    const allowed = UsedRefUtil.fromColumnMap(table.columns);

    for (const columnAlias of Object.keys(raw)) {
        const customExpr = raw[columnAlias as keyof typeof raw];
        if (customExpr === undefined) {
            continue;
        }
        if (table.mutableColumns.indexOf(columnAlias) < 0) {
            //This columnAlias is not mutable...
            if (
                Object.prototype.hasOwnProperty.call(table.columns, columnAlias) &&
                Object.prototype.propertyIsEnumerable.call(table.columns, columnAlias)
            ) {
                throw new Error(`${table.alias}.${columnAlias} is not mutable`);
            } else {
                //Just some random extra property that is not a `columnAlias` of `TableT`.
                //This probably only got through because TS does not have exact types at the moment.
                continue;
            }
        }

        result[columnAlias as keyof typeof raw] = BuiltInExprUtil.fromCustomExpr_MapCorrelated(
            table.columns[columnAlias],
            allowed,
            customExpr
        );
    }

    /*
    if (Object.keys(result).length == 0) {
        //The user specified an empty assignment map?
        //Very weird...
        if (table.mutableColumns.length == 0) {
            throw new Error(`${table.alias} has no mutable columns`);
        }
        const firstColumnAlias = table.mutableColumns[0];
        const firstColumn = table.columns[firstColumnAlias];
        //We specify a no-op assignment, to prevent the `UpdateConnection` from crashing
        result[firstColumnAlias as keyof typeof result] = firstColumn as any;
    }
    */
    return result;
}
