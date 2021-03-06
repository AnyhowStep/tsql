import * as tm from "type-mapping";
import {IColumn} from "../../column";
import {Column} from "../../column-impl";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type ToNullableImpl<
    TableAliasT extends IColumn["tableAlias"],
    ColumnAliasT extends IColumn["columnAlias"],
    MapperT extends IColumn["mapper"],
> = (
    Column<{
        tableAlias : TableAliasT,
        columnAlias : ColumnAliasT,
        mapper : tm.SafeMapper<
            null|
            tm.OutputOf<MapperT>
        >,
    }>
);
/*
    Used to implement LEFT/RIGHT JOINs.

    When doing a LEFT/RIGHT JOIN,
    certain columns become nullable
    because the row may be missing.
*/
export type ToNullable<ColumnT extends IColumn> = (
    ColumnT extends IColumn ?
    ToNullableImpl<
        ColumnT["tableAlias"],
        ColumnT["columnAlias"],
        ColumnT["mapper"]
    > :
    never
);
export function toNullable<ColumnT extends IColumn> (
    {
        tableAlias,
        columnAlias,
        mapper,
        unaliasedAst,
    } : ColumnT
) : (
    ToNullable<ColumnT>
) {
    return new Column(
        {
            tableAlias,
            columnAlias,
            mapper : tm.orNull(mapper),
        },
        unaliasedAst
    ) as IColumn as ToNullable<ColumnT>;
}
