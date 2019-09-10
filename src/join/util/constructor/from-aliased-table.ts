import {Join} from "../../join-impl";
import {IAliasedTable, AliasedTableUtil} from "../../../aliased-table";
import {JoinType} from "../../join";
import {OnClause} from "../../../on-clause";

export type FromAliasedTableImpl<
    AliasedTableT extends IAliasedTable,
    NullableT extends boolean
> = (
    Join<{
        tableAlias : AliasedTableT["alias"],
        nullable : NullableT,
        /**
         * These columns can have their types narrowed.
         * For example, with the `IS NULL` or `IS NOT NULL` or `=` operators.
         */
        columns : AliasedTableT["columns"],

        /**
         * Needed for multi-table `UPDATE` statements.
         * So, we will know the data type of each column.
         */
        originalColumns : AliasedTableT["columns"],

        /**
         * Needed for `whereEqPrimaryKey()`
         */
        primaryKey : AliasedTableUtil.PrimaryKey<AliasedTableT>;

        /**
         * Needed for `whereEqCandidateKey()`
         */
        candidateKeys : AliasedTableUtil.CandidateKeys<AliasedTableT>;

        /**
         * Needed for multi-table `DELETE` statements.
         * We need to know which tables we can delete rows from.
         */
        deleteEnabled : AliasedTableUtil.DeleteEnabled<AliasedTableT>,

        /**
         * Needed for multi-table `UPDATE` statements.
         * We need to know which columns are mutable.
         */
        mutableColumns : AliasedTableUtil.MutableColumns<AliasedTableT>;
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
    onClause : OnClause|undefined
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
            candidateKeys : AliasedTableUtil.candidateKeys(aliasedTable),
            deleteEnabled : AliasedTableUtil.deleteEnabled(aliasedTable),
            mutableColumns : AliasedTableUtil.mutableColumns(aliasedTable),
        },
        joinType,
        onClause,
        aliasedTable.unaliasedAst
    );
    return result as FromAliasedTable<AliasedTableT, NullableT>;
}
