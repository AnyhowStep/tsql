import * as tm from "type-mapping";
import {IJoin} from "../../join";
import * as JoinUtil from "../../util";

export type ReplaceColumn<
    JoinsT extends readonly IJoin[],
    TableAliasT extends string,
    ColumnAliasT extends string,
    TypeT
> = (
    readonly (
        JoinUtil.ReplaceColumn<
            JoinsT[number],
            TableAliasT,
            ColumnAliasT,
            TypeT
        >
    )[]
);
export function replaceColumn<
    JoinsT extends readonly IJoin[],
    TableAliasT extends string,
    ColumnAliasT extends string,
    TypeT
> (
    joins : JoinsT,
    tableAlias : TableAliasT,
    columnAlias : ColumnAliasT,
    mapper : tm.SafeMapper<TypeT>
) : (
    ReplaceColumn<
        JoinsT,
        TableAliasT,
        ColumnAliasT,
        TypeT
    >
) {
    return joins.map(join => JoinUtil.replaceColumn(
        join,
        tableAlias,
        columnAlias,
        mapper
    ));
}
