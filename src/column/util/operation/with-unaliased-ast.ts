import * as tm from "type-mapping";
import {IColumn} from "../../column";
import {Column} from "../../column-impl";
import {TryReuseExistingType} from "../../../type-util";
import {Ast} from "../../../ast";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type WithUnaliasedAstImpl<
    TableAliasT extends string,
    ColumnAliasT extends string,
    MapperT extends tm.AnySafeMapper
> = (
    Column<{
        tableAlias : TableAliasT,
        columnAlias : ColumnAliasT,
        mapper : MapperT,
    }>
);
/**
 * Used to narrow the type of a column
 */
export type WithUnaliasedAst<
    ColumnT extends IColumn
> = (
    ColumnT extends IColumn ?
    TryReuseExistingType<
        ColumnT,
        WithUnaliasedAstImpl<
            ColumnT["tableAlias"],
            ColumnT["columnAlias"],
            ColumnT["mapper"]
        >
    > :
    never
);
export function withUnaliasedAst<
    ColumnT extends IColumn
> (
    {
        tableAlias,
        columnAlias,
        mapper,
    } : ColumnT,
    unaliasedAst : Ast|undefined
) : (
    WithUnaliasedAst<ColumnT>
) {
    const result = new Column(
        {
            tableAlias,
            columnAlias,
            mapper,
        },
        unaliasedAst
    );
    return result as WithUnaliasedAst<ColumnT>;
}
