import * as tm from "type-mapping";
import {IColumn} from "../../column";
import {Column} from "../../column-impl";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WithTypeImpl<
    TypeT,
    TableAliasT extends string,
    ColumnAliasT extends string,
> = (
    Column<{
        tableAlias : TableAliasT,
        columnAlias : ColumnAliasT,
        mapper : tm.SafeMapper<TypeT>,
    }>
);
/**
 * Used to narrow the type of a column
 */
export type WithType<
    ColumnT extends IColumn,
    TypeT
> = (
    ColumnT extends IColumn ?
    WithTypeImpl<
        TypeT,
        ColumnT["tableAlias"],
        ColumnT["columnAlias"]
    > :
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
