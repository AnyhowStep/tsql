import * as tm from "type-mapping";
import {IColumn} from "../../column";
import {Column} from "../../column-impl";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type ToNonNullableImpl<
    TableAliasT extends IColumn["tableAlias"],
    ColumnAliasT extends IColumn["columnAlias"],
    MapperT extends IColumn["mapper"],
> = (
    Column<{
        tableAlias : TableAliasT,
        columnAlias : ColumnAliasT,
        mapper : tm.SafeMapper<
            Exclude<
                tm.OutputOf<MapperT>,
                null
            >
        >,
    }>
);
/**
 * Used to implement narrowing functions
 */
export type ToNonNullable<ColumnT extends IColumn> = (
    ColumnT extends IColumn ?
    ToNonNullableImpl<
        ColumnT["tableAlias"],
        ColumnT["columnAlias"],
        ColumnT["mapper"]
    > :
    never
);
export function toNonNullable<ColumnT extends IColumn> (
    {
        tableAlias,
        columnAlias,
        mapper,
        unaliasedAst,
    } : ColumnT
) : (
    ToNonNullable<ColumnT>
) {
    return new Column(
        {
            tableAlias,
            columnAlias,
            mapper : tm.notNull(mapper),
        },
        unaliasedAst
    ) as IColumn as ToNonNullable<ColumnT>;
}
