import * as tm from "type-mapping";
import {IColumn} from "../../column";
import {Column} from "../../column-impl";

/**
 * Used to narrow the type of a column
 */
export type WithType<
    ColumnT extends IColumn,
    TypeT
> = (
    ColumnT extends IColumn ?
    Column<{
        tableAlias : ColumnT["tableAlias"],
        columnAlias : ColumnT["columnAlias"],
        mapper : tm.SafeMapper<TypeT>,
    }> :
    never
);
export function withType<
    ColumnT extends IColumn,
    TypeT
> (
    {
        tableAlias,
        columnAlias,
        unaliasedAst,
    } : ColumnT,
    newMapper : tm.SafeMapper<TypeT>
) : (
    WithType<ColumnT, TypeT>
) {
    const result = new Column(
        {
            tableAlias,
            columnAlias,
            mapper : newMapper,
        },
        unaliasedAst
    );
    return result as WithType<ColumnT, TypeT>;
}
