import * as tm from "type-mapping";
import {IColumn} from "../../column";
import {Column} from "../../column-impl";

/*
    Used to implement LEFT/RIGHT JOINs.

    When doing a LEFT/RIGHT JOIN,
    certain columns become nullable
    because the row may be missing.
*/
export type ToNullable<ColumnT extends IColumn> = (
    ColumnT extends IColumn ?
    Column<{
        tableAlias : ColumnT["tableAlias"],
        columnAlias : ColumnT["columnAlias"],
        mapper : tm.SafeMapper<
            null|
            ReturnType<ColumnT["mapper"]>
        >,
    }> :
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
