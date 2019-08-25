import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
    })

const outerQueryTable = tsql.table("outerQueryTable")
    .addColumns({
        outerQueryTableId : tm.mysql.bigIntSigned(),
    })

declare const otherTable : tsql.AliasedTable<{
    isLateral : false;
    alias : "otherTable";
    columns : {
        otherTableId : tsql.IColumn<{
            tableAlias : "otherTable",
            columnAlias : "otherTableId",
            mapper : tm.SafeMapper<bigint>,
        }>
    };
    usedRef : tsql.IUsedRef<{
        outerQueryTable : {
            outerQueryTableId : bigint,
        }
    }>;
}>;

/**
 * You cannot reference outer query joins in MySQL 8.
 * You cannot reference outer query joins in MySQL 5.7.
 * You can reference outer query joins in PostgreSQL 9.4.
 * You can reference outer query joins in SQLite 3.26.
 *
 * The SQL standard allows it. MySQL just doesn't.
 */
export function leftJoinNoOuterQueryReference<
    FromClauseT extends tsql.FromClauseUtil.AfterFromClause,
    AliasedTableT extends tsql.IAliasedTable,
    RawOnClauseT extends tsql.RawExpr<boolean>
> (
    fromClause : FromClauseT,
    aliasedTable : (
        & AliasedTableT
        & tsql.TypeUtil.AssertNonUnion<AliasedTableT>
        & tsql.FromClauseUtil.AssertValidCurrentJoinBase<FromClauseT, AliasedTableT>
    ),
    onDelegate : tsql.OnDelegate<
        FromClauseT,
        AliasedTableT,
        (
            & RawOnClauseT
            & tsql.OnClauseUtil.AssertNoOuterQueryUsedRef<FromClauseT, RawOnClauseT>
        )
    >
) : (
    tsql.FromClauseUtil.InnerJoin<FromClauseT, AliasedTableT>
) {
    return tsql.FromClauseUtil.leftJoin<
        FromClauseT,
        AliasedTableT,
        (
            & RawOnClauseT
            & tsql.OnClauseUtil.AssertNoOuterQueryUsedRef<FromClauseT, RawOnClauseT>
        )
    >(
        fromClause,
        aliasedTable,
        (columns) => {
            const result = onDelegate(columns);
            tsql.OnClauseUtil.assertNoOuterQueryUsedRef(fromClause, result);
            return result;
        }
    );
}
leftJoinNoOuterQueryReference(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.requireOuterQueryJoins(
            tsql.FromClauseUtil.newInstance(),
            outerQueryTable
        ),
        myTable
    ),
    otherTable,
    columns => tsql.notEq(
        columns.outerQueryTable.outerQueryTableId,
        columns.myTable.myTableId
    )
);
export const fromClause = leftJoinNoOuterQueryReference(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.requireOuterQueryJoins(
            tsql.FromClauseUtil.newInstance(),
            outerQueryTable
        ),
        myTable
    ),
    otherTable,
    //Same-query table is okay
    columns => tsql.notEq(
        columns.myTable.myTableId,
        columns.otherTable.otherTableId
    )
);
