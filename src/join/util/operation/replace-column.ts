import * as tm from "type-mapping";
import {IJoin} from "../../join";
import {IColumn} from "../../../column";
import {ColumnMapUtil} from "../../../column-map";
import {Join} from "../../join-impl";

export type ReplaceColumn<
    JoinT extends IJoin,
    TableAliasT extends string,
    ColumnAliasT extends string,
    TypeT
> = (
    JoinT extends { tableAlias : TableAliasT, columns : { [columnAlias in ColumnAliasT] : IColumn } } ?
    (
        Join<{
            tableAlias : JoinT["tableAlias"],
            nullable : JoinT["nullable"],
            columns : ColumnMapUtil.ReplaceColumn<
                JoinT["columns"],
                ColumnAliasT,
                TypeT
            >,
            originalColumns : JoinT["originalColumns"],
            primaryKey : JoinT["primaryKey"],
            deleteEnabled : JoinT["deleteEnabled"],
            mutableColumns : JoinT["mutableColumns"],
        }>
    ) :
    //No replacement
    JoinT
);

export function replaceColumn<
    JoinT extends IJoin,
    TableAliasT extends string,
    ColumnAliasT extends string,
    TypeT
> (
    join : JoinT,
    tableAlias : TableAliasT,
    columnAlias : ColumnAliasT,
    mapper : tm.SafeMapper<TypeT>
) : (
    ReplaceColumn<
        JoinT,
        TableAliasT,
        ColumnAliasT,
        TypeT
    >
) {
    if (
        join.tableAlias == tableAlias &&
        Object.prototype.hasOwnProperty.call(join.columns, columnAlias) &&
        Object.prototype.propertyIsEnumerable.call(join.columns, columnAlias)
    ) {
        const {
            tableAlias,
            nullable,
            columns,
            originalColumns,
            primaryKey,
            deleteEnabled,
            mutableColumns,
        } = join;

        const result = new Join(
            {
                tableAlias,
                nullable,
                columns : ColumnMapUtil.replaceColumn(
                    columns,
                    columnAlias,
                    mapper
                ),
                originalColumns,
                primaryKey,
                deleteEnabled,
                mutableColumns,
            },
            join.joinType,
            join.from,
            join.to
        );
        return result as ReplaceColumn<
            JoinT,
            TableAliasT,
            ColumnAliasT,
            TypeT
        >;
    } else {
        return join as ReplaceColumn<
            JoinT,
            TableAliasT,
            ColumnAliasT,
            TypeT
        >;
    }
}
