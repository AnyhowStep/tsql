import {ExtraQueryData, QueryData, IQuery} from "./query";
import {WhereClause, WhereDelegate} from "../where-clause";
import {GroupByClause} from "../group-by-clause";
import {HavingClause} from "../having-clause";
import {OrderByClause} from "../order-by-clause";
import {IAliasedTable} from "../aliased-table";
import {FromClauseUtil} from "../from-clause";
import {SelectClause, SelectDelegate} from "../select-clause";
import {RawExpr} from "../raw-expr";
import {OnDelegate, OnClauseUtil} from "../on-clause";
import {ITable, TableUtil, TableWithPrimaryKey} from "../table";
/**
 * @todo Rename to `UnifiedQueryUtil` or something
 */
import * as QueryUtil from "./util";
import * as TypeUtil from "../type-util";
import * as ExprLib from "../expr-library";

export class Query<DataT extends QueryData> implements IQuery<DataT> {
    readonly fromClause : DataT["fromClause"];
    readonly selectClause : DataT["selectClause"];

    readonly limitClause : DataT["limitClause"];

    readonly unionClause : DataT["unionClause"];
    readonly unionLimitClause : DataT["unionLimitClause"];

    readonly whereClause : WhereClause|undefined;
    readonly groupByClause : GroupByClause|undefined;
    readonly havingClause : HavingClause|undefined;
    readonly orderByClause : OrderByClause|undefined;

    constructor (data : DataT, extraData : ExtraQueryData) {
        this.fromClause = data.fromClause;
        this.selectClause = data.selectClause;
        this.limitClause = data.limitClause;
        this.unionClause = data.unionClause;
        this.unionLimitClause = data.unionLimitClause;

        this.whereClause = extraData.whereClause;
        this.groupByClause = extraData.groupByClause;
        this.havingClause = extraData.havingClause;
        this.orderByClause = extraData.orderByClause;
    }

    requireOuterQueryJoins<
        AliasedTablesT extends readonly IAliasedTable[]
    > (
        ...aliasedTables : (
            & AliasedTablesT
            & FromClauseUtil.AssertValidOuterQueryJoins<this["fromClause"], AliasedTablesT>
        )
    ) : (
        QueryUtil.RequireOuterQueryJoins<this, AliasedTablesT>
    ) {
        return QueryUtil.requireOuterQueryJoins<
            this,
            AliasedTablesT
        >(
            this,
            ...(aliasedTables as any)
        );
    }
    requireNullableOuterQueryJoins<
        AliasedTablesT extends readonly IAliasedTable[]
    > (
        ...aliasedTables : (
            & AliasedTablesT
            & FromClauseUtil.AssertValidOuterQueryJoins<this["fromClause"], AliasedTablesT>
        )
    ) : (
        QueryUtil.RequireNullableOuterQueryJoins<this, AliasedTablesT>
    ) {
        return QueryUtil.requireNullableOuterQueryJoins<
            this,
            AliasedTablesT
        >(
            this,
            ...(aliasedTables as any)
        );
    }

    from<
        AliasedTableT extends IAliasedTable
    > (
        this : Extract<this, QueryUtil.BeforeFromClause>,
        aliasedTable : (
            & AliasedTableT
            & QueryUtil.AssertValidCurrentJoin<Extract<this, QueryUtil.BeforeFromClause>, AliasedTableT>
        )
    ) : (
        QueryUtil.From<Extract<this, QueryUtil.BeforeFromClause>, AliasedTableT>
    ) {
        return QueryUtil.from<
            Extract<this, QueryUtil.BeforeFromClause>,
            AliasedTableT
        >(
            this,
            aliasedTable
        );
    }

    crossJoin<
        AliasedTableT extends IAliasedTable
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        aliasedTable : (
            & AliasedTableT
            & TypeUtil.AssertNonUnion<AliasedTableT>
            & QueryUtil.AssertValidCurrentJoin<Extract<this, QueryUtil.AfterFromClause>, AliasedTableT>
        )
    ) : (
        QueryUtil.CrossJoin<Extract<this, QueryUtil.AfterFromClause>, AliasedTableT>
    ) {
        return QueryUtil.crossJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >(
            this,
            aliasedTable
        );
    }

    innerJoinUsingCandidateKey<
        SrcT extends Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"][number],
        DstT extends ITable,
        SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        srcDelegate : FromClauseUtil.InnerJoinUsingCandidateKeySrcDelegate<Extract<this, QueryUtil.AfterFromClause>["fromClause"], SrcT>,
        aliasedTable : (
            & DstT
            & TypeUtil.AssertNonUnion<DstT>
            & QueryUtil.AssertValidCurrentJoin<Extract<this, QueryUtil.AfterFromClause>, DstT>
        ),
        eqCandidateKeyofTableDelegate : ExprLib.EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
    ) : (
        QueryUtil.InnerJoinUsingCandidateKey<Extract<this, QueryUtil.AfterFromClause>, DstT>
    ) {
        return QueryUtil.innerJoinUsingCandidateKey<
            Extract<this, QueryUtil.AfterFromClause>,
            SrcT,
            DstT,
            SrcColumnsT
        >(
            this,
            srcDelegate,
            aliasedTable,
            eqCandidateKeyofTableDelegate
        );
    }

    innerJoinUsingPrimaryKey<
        SrcT extends Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"][number],
        DstT extends TableWithPrimaryKey
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        srcDelegate : FromClauseUtil.InnerJoinUsingPrimaryKeySrcDelegate<Extract<this, QueryUtil.AfterFromClause>["fromClause"], SrcT>,
        aliasedTable : (
            & DstT
            & TypeUtil.AssertNonUnion<DstT>
            & QueryUtil.AssertValidCurrentJoin<Extract<this, QueryUtil.AfterFromClause>, DstT>
            & TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
        )
    ) : (
        QueryUtil.InnerJoinUsingPrimaryKey<Extract<this, QueryUtil.AfterFromClause>, DstT>
    ) {
        return QueryUtil.innerJoinUsingPrimaryKey<
            Extract<this, QueryUtil.AfterFromClause>,
            SrcT,
            DstT
        >(
            this,
            srcDelegate,
            aliasedTable
        );
    }

    innerJoin<
        AliasedTableT extends IAliasedTable,
        RawOnClauseT extends RawExpr<boolean>
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        aliasedTable : (
            & AliasedTableT
            & TypeUtil.AssertNonUnion<AliasedTableT>
            & QueryUtil.AssertValidCurrentJoin<Extract<this, QueryUtil.AfterFromClause>, AliasedTableT>
        ),
        onDelegate : OnDelegate<
            Extract<this, QueryUtil.AfterFromClause>["fromClause"],
            AliasedTableT,
            (
                & RawOnClauseT
                & OnClauseUtil.AssertNoOuterQueryUsedRef<Extract<this, QueryUtil.AfterFromClause>["fromClause"], RawOnClauseT>
            )
        >
    ) : (
        QueryUtil.InnerJoin<Extract<this, QueryUtil.AfterFromClause>, AliasedTableT>
    ) {
        return QueryUtil.innerJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT,
            RawOnClauseT
        >(
            this,
            aliasedTable,
            onDelegate
        );
    }

    leftJoinUsingCandidateKey<
        SrcT extends Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"][number],
        DstT extends ITable,
        SrcColumnsT extends TableUtil.ColumnArraysFromCandidateKeys<SrcT, DstT>
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        srcDelegate : FromClauseUtil.LeftJoinUsingCandidateKeySrcDelegate<Extract<this, QueryUtil.AfterFromClause>["fromClause"], SrcT>,
        aliasedTable : (
            & DstT
            & TypeUtil.AssertNonUnion<DstT>
            & QueryUtil.AssertValidCurrentJoin<Extract<this, QueryUtil.AfterFromClause>, DstT>
        ),
        eqCandidateKeyofTableDelegate : ExprLib.EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
    ) : (
        QueryUtil.LeftJoinUsingCandidateKey<Extract<this, QueryUtil.AfterFromClause>, DstT>
    ) {
        return QueryUtil.leftJoinUsingCandidateKey<
            Extract<this, QueryUtil.AfterFromClause>,
            SrcT,
            DstT,
            SrcColumnsT
        >(
            this,
            srcDelegate,
            aliasedTable,
            eqCandidateKeyofTableDelegate
        );
    }

    leftJoinUsingPrimaryKey<
        SrcT extends Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"][number],
        DstT extends TableWithPrimaryKey
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        srcDelegate : FromClauseUtil.LeftJoinUsingPrimaryKeySrcDelegate<Extract<this, QueryUtil.AfterFromClause>["fromClause"], SrcT>,
        aliasedTable : (
            & DstT
            & TypeUtil.AssertNonUnion<DstT>
            & QueryUtil.AssertValidCurrentJoin<Extract<this, QueryUtil.AfterFromClause>, DstT>
            & TableUtil.AssertHasNullSafeComparablePrimaryKey<DstT, SrcT["columns"]>
        )
    ) : (
        QueryUtil.LeftJoinUsingPrimaryKey<Extract<this, QueryUtil.AfterFromClause>, DstT>
    ) {
        return QueryUtil.leftJoinUsingPrimaryKey<
            Extract<this, QueryUtil.AfterFromClause>,
            SrcT,
            DstT
        >(
            this,
            srcDelegate,
            aliasedTable
        );
    }

    leftJoin<
        AliasedTableT extends IAliasedTable,
        RawOnClauseT extends RawExpr<boolean>
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        aliasedTable : (
            & AliasedTableT
            & TypeUtil.AssertNonUnion<AliasedTableT>
            & QueryUtil.AssertValidCurrentJoin<Extract<this, QueryUtil.AfterFromClause>, AliasedTableT>
        ),
        onDelegate : OnDelegate<
            Extract<this, QueryUtil.AfterFromClause>["fromClause"],
            AliasedTableT,
            (
                & RawOnClauseT
                & OnClauseUtil.AssertNoOuterQueryUsedRef<Extract<this, QueryUtil.AfterFromClause>["fromClause"], RawOnClauseT>
            )
        >
    ) : (
        QueryUtil.LeftJoin<Extract<this, QueryUtil.AfterFromClause>, AliasedTableT>
    ) {
        return QueryUtil.leftJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT,
            RawOnClauseT
        >(
            this,
            aliasedTable,
            onDelegate
        );
    }

    select<
        SelectsT extends SelectClause
    > (
        this : Extract<this, QueryUtil.BeforeUnionClause>,
        selectDelegate : SelectDelegate<this["fromClause"], this["selectClause"], SelectsT>
    ) : (
        QueryUtil.Select<Extract<this, QueryUtil.BeforeUnionClause>, SelectsT>
    ) {
        return QueryUtil.select<Extract<this, QueryUtil.BeforeUnionClause>, SelectsT>(this, selectDelegate);
    }

    where (
        whereDelegate : WhereDelegate<
            this["fromClause"]
        >
    ) : (
        QueryUtil.Where<this>
    ) {
        return QueryUtil.where<
            this
        >(
            this,
            whereDelegate
        );
    }
}
