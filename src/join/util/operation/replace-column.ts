import * as tm from "type-mapping";
import {IJoin} from "../../join";
import {ColumnMapUtil} from "../../../column-map";
import {Join} from "../../join-impl";
import {IColumn} from "../../../column";

/**
 * https://github.com/microsoft/TypeScript/issues/32707#issuecomment-518347966
 *
 * This hack should only really be reserved for types that are more likely
 * to trigger max depth/max count errors.
 */
export type ReplaceColumnImpl<
    ColumnAliasT extends string,
    TypeT,
    TableAliasT extends IJoin["tableAlias"],
    NullableT extends IJoin["nullable"],
    ColumnsT extends IJoin["columns"],
    OriginalColumnsT extends IJoin["originalColumns"],
    PrimaryKeyT extends IJoin["primaryKey"],
    DeleteEnabledT extends IJoin["deleteEnabled"],
    MutableColumnsT extends IJoin["mutableColumns"]
> = (
    Join<{
        tableAlias : TableAliasT,
        nullable : NullableT,
        columns : ColumnMapUtil.ReplaceColumn<
            ColumnsT,
            ColumnAliasT,
            TypeT
        >,
        originalColumns : OriginalColumnsT,
        primaryKey : PrimaryKeyT,
        deleteEnabled : DeleteEnabledT,
        mutableColumns : MutableColumnsT,
    }>
);
export type ReplaceColumn<
    JoinT extends IJoin,
    TableAliasT extends string,
    ColumnAliasT extends string,
    TypeT
> = (
    /*JoinT extends IJoin ?
    (
        JoinT["tableAlias"] extends TableAliasT ?
        (
            /**
             * ColumnAliasT shouldn't be a union type, in general.
             * Should be a unit type.
             * So, this should work.
             * /
            ColumnAliasT extends keyof JoinT["columns"] ?
            ReplaceColumnImpl<
                ColumnAliasT,
                TypeT,
                JoinT["tableAlias"],
                JoinT["nullable"],
                JoinT["columns"],
                JoinT["originalColumns"],
                JoinT["primaryKey"],
                JoinT["deleteEnabled"],
                JoinT["mutableColumns"]
            > :
            //No replacement
            JoinT
        ) :
        //No replacement
        JoinT
    ) :
    never*/
    JoinT extends { tableAlias : TableAliasT, columns : { [columnAlias in ColumnAliasT] : IColumn } } ?
    (
        ReplaceColumnImpl<
            ColumnAliasT,
            TypeT,
            JoinT["tableAlias"],
            JoinT["nullable"],
            JoinT["columns"],
            JoinT["originalColumns"],
            JoinT["primaryKey"],
            JoinT["deleteEnabled"],
            JoinT["mutableColumns"]
        >
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

        const result = new Join<{
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
        }>(
            {
                tableAlias,
                nullable,
                columns : ColumnMapUtil.replaceColumn<
                    JoinT["columns"],
                    ColumnAliasT,
                    TypeT
                >(
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
