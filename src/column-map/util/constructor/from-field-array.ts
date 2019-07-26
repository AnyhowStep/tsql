import * as tm from "type-mapping";
import {WritableColumnMap} from "../../column-map";
import {Column} from "../../../column";

/*
    In general, having any[] -> {} conversions
    requires more care.
*/
export type FromFieldArray<
    TableAliasT extends string,
    FieldsT extends readonly tm.AnyField[]
> = (
    FieldsT[number] extends never ?
    {} :
    {
        readonly [columnAlias in FieldsT[number]["__name"]] : (
            Column<{
                tableAlias : TableAliasT,
                columnAlias : columnAlias,
                mapper : tm.SafeMapper<tm.OutputOf<
                    Extract<FieldsT[number], tm.Name<columnAlias>>
                >>
            }>
        )
    }
);
export function fromFieldArray<
    TableAliasT extends string,
    FieldsT extends readonly tm.AnyField[]
> (
    tableAlias : TableAliasT,
    fields : FieldsT
) : (
    FromFieldArray<TableAliasT, FieldsT>
) {
    const result : WritableColumnMap = {};
    for (const field of fields) {
        result[field.__name] = new Column(
            {
                tableAlias : tableAlias,
                columnAlias : field.__name,
                mapper : field,
            },
            undefined
        );
    }
    return result as FromFieldArray<TableAliasT, FieldsT>;
}
