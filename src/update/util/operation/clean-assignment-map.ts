import {ITable} from "../../../table";
import {AssignmentMap} from "../../assignment-map";
import {UsedRefUtil} from "../../../used-ref";
import {RawExprUtil, AnyRawExpr} from "../../../raw-expr";
import {PrimitiveExprUtil} from "../../../primitive-expr";

export function cleanAssignmentMap<
    TableT extends ITable
> (
    table : TableT,
    raw : AssignmentMap<TableT>
) : AssignmentMap<TableT> {
    const result = {} as AssignmentMap<TableT>;

    const allowed = UsedRefUtil.fromColumnMap(table.columns);

    for (const columnAlias of Object.keys(raw)) {
        const value = raw[columnAlias as keyof typeof raw];
        if (value === undefined) {
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

        UsedRefUtil.assertAllowed(
            allowed,
            RawExprUtil.usedRef(value as AnyRawExpr)
        );

        result[columnAlias as keyof typeof raw] = PrimitiveExprUtil.isPrimitiveExpr(value) ?
            table.columns[columnAlias].mapper(`${table.alias}.${columnAlias}`, value) :
            value;
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
