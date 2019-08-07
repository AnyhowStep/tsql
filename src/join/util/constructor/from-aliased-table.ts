import {Join} from "../../join-impl";
import {IAliasedTable, AliasedTableUtil} from "../../../aliased-table";
import {JoinType} from "../../join";
import {IColumn} from "../../../column";

export type FromAliasedTableImpl<
    AliasedTableT extends IAliasedTable,
    NullableT extends boolean
> = (
    Join<{
        readonly tableAlias : AliasedTableT["alias"],
        readonly nullable : NullableT,
        /**
         * These columns can have their types narrowed.
         * For example, with the `IS NULL` or `IS NOT NULL` or `=` operators.
         */
        readonly columns : AliasedTableT["columns"],

        /**
         * Needed for multi-table `UPDATE` statements.
         * So, we will know the data type of each column.
         */
        readonly originalColumns : AliasedTableT["columns"],

        /**
         * Needed for `joinFromPk()`
         */
        readonly primaryKey : AliasedTableUtil.PrimaryKey<AliasedTableT>;

        /**
         * Needed for multi-table `DELETE` statements.
         * We need to know which tables we can delete rows from.
         */
        readonly deleteEnabled : AliasedTableUtil.DeleteEnabled<AliasedTableT>,

        /**
         * Needed for multi-table `UPDATE` statements.
         * We need to know which columns are mutable.
         */
        readonly mutableColumns : AliasedTableUtil.MutableColumns<AliasedTableT>;
    }>
);
export type FromAliasedTable<
    AliasedTableT extends IAliasedTable,
    NullableT extends boolean
> = (
    AliasedTableT extends IAliasedTable ?
    FromAliasedTableImpl<AliasedTableT, NullableT> :
    never
);
export function fromAliasedTable<
    AliasedTableT extends IAliasedTable,
    NullableT extends boolean
> (
    aliasedTable : AliasedTableT,
    nullable : NullableT,
    joinType : JoinType,
    from : readonly IColumn[],
    to : readonly IColumn[],
) : (
    FromAliasedTable<AliasedTableT, NullableT>
) {
    const result : FromAliasedTableImpl<AliasedTableT, NullableT> = new Join(
        {
            tableAlias : aliasedTable.alias,
            nullable,

            columns : aliasedTable.columns,
            originalColumns : aliasedTable.columns,

            primaryKey : AliasedTableUtil.primaryKey(aliasedTable),
            deleteEnabled : AliasedTableUtil.deleteEnabled(aliasedTable),
            mutableColumns : AliasedTableUtil.mutableColumns(aliasedTable),
        },
        joinType,
        from,
        to
    );
    return result as FromAliasedTable<AliasedTableT, NullableT>;
}
