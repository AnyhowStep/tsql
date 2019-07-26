import {IColumn} from "../../column";
import {Column} from "../../column-impl";

/**
 * Used to implement the `AS` clause,
 *
 * ```sql
 *  SELECT
 *      *
 *  FROM
 *      myTable AS aliased
 * ```
 */
export type WithTableAlias<
    ColumnT extends IColumn,
    NewTableAliasT extends string
> = (
    ColumnT extends IColumn ?
    Column<{
        tableAlias : NewTableAliasT,
        columnAlias : ColumnT["columnAlias"],
        mapper : ColumnT["mapper"],
    }> :
    never
);
export function withTableAlias<
    ColumnT extends IColumn,
    NewTableAliasT extends string
> (
    {
        columnAlias,
        mapper,
        unaliasedAst,
    } : ColumnT,
    newTableAlias : NewTableAliasT
) : (
    WithTableAlias<ColumnT, NewTableAliasT>
) {
    const result = new Column(
        {
            tableAlias : newTableAlias,
            columnAlias,
            mapper,
        },
        unaliasedAst
    );
    return result as WithTableAlias<ColumnT, NewTableAliasT>;
}
