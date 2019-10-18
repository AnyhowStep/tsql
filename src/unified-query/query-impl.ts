import * as tm from "type-mapping";
import {ExtraQueryData, QueryData, IQuery} from "./query";
import {WhereClause, WhereDelegate} from "../where-clause";
import {GroupByClause, GroupByDelegate} from "../group-by-clause";
import {HavingClause, HavingDelegate} from "../having-clause";
import {OrderByClause, OrderByDelegate} from "../order-by-clause";
import {IAliasedTable} from "../aliased-table";
import {FromClauseUtil} from "../from-clause";
import {SelectClause} from "../select-clause";
import {RawExpr, AnyRawExpr, AnySubqueryExpr} from "../raw-expr";
import {OnDelegate, OnClauseUtil} from "../on-clause";
import {ITable, TableUtil, TableWithPrimaryKey} from "../table";
import {ColumnUtil} from "../column";
import {PrimitiveExpr, NonNullPrimitiveExpr} from "../primitive-expr";
import {JoinArrayUtil} from "../join";
import {SuperKey_NonUnion} from "../super-key";
import {PrimaryKey_NonUnion} from "../primary-key";
import {PartialRow_NonUnion} from "../partial-row";
import {CandidateKey_NonUnion} from "../candidate-key";
/**
 * @todo Rename to `UnifiedQueryUtil` or something
 */
import * as QueryUtil from "./util";
import * as TypeUtil from "../type-util";
import * as ExprLib from "../expr-library";
import {CompoundQueryOrderByClause, CompoundQueryOrderByDelegate} from "../compound-query-order-by-clause";
import {QueryBaseUtil} from "../query-base";
import {CompoundQueryType} from "../compound-query";
import {CompoundQueryClauseUtil} from "../compound-query-clause";
import {MapDelegate} from "../map-delegate";
import {ExecutionUtil, SelectConnection, IsolableSelectConnection} from "../execution";

export class Query<DataT extends QueryData> implements IQuery<DataT> {
    readonly fromClause : DataT["fromClause"];
    readonly selectClause : DataT["selectClause"];

    readonly limitClause : DataT["limitClause"];

    readonly compoundQueryClause : DataT["compoundQueryClause"];
    readonly compoundQueryLimitClause : DataT["compoundQueryLimitClause"];

    readonly mapDelegate : DataT["mapDelegate"];

    readonly whereClause : WhereClause|undefined;
    readonly groupByClause : GroupByClause|undefined;
    readonly havingClause : HavingClause|undefined;
    readonly orderByClause : OrderByClause|undefined;
    readonly compoundQueryOrderByClause : CompoundQueryOrderByClause|undefined;
    readonly isDistinct : boolean;

    constructor (data : DataT, extraData : ExtraQueryData) {
        this.fromClause = data.fromClause;
        this.selectClause = data.selectClause;
        this.limitClause = data.limitClause;
        this.compoundQueryClause = data.compoundQueryClause;
        this.compoundQueryLimitClause = data.compoundQueryLimitClause;
        this.mapDelegate = data.mapDelegate;

        this.whereClause = extraData.whereClause;
        this.groupByClause = extraData.groupByClause;
        this.havingClause = extraData.havingClause;
        this.orderByClause = extraData.orderByClause;
        this.compoundQueryOrderByClause = extraData.compoundQueryOrderByClause;
        this.isDistinct = extraData.isDistinct;
    }

    /*
        One should be careful about using LIMIT, OFFSET
        without an ORDER BY clause.

        In general, if your WHERE condition uniquely identifies
        the row, then LIMIT and OFFSET are not required
        and can be safely used without an ORDER BY.

        The problem is when the WHERE condition *does not*
        uniquely identify a row.

        Then, LIMIT and OFFSET can return inconsistent results.
    */
    limit<
        MaxRowCountT extends bigint
    > (
        maxRowCount : MaxRowCountT
    ) : (
        QueryUtil.LimitBigInt<this, MaxRowCountT>
    );
    limit (
        maxRowCount : 0
    ) : (
        QueryUtil.LimitNumber0<this>
    );
    limit (
        maxRowCount : 1
    ) : (
        QueryUtil.LimitNumber1<this>
    );
    limit (
        maxRowCount : 0|1
    ) : (
        QueryUtil.LimitNumber0Or1<this>
    );
    limit (
        maxRowCount : number|bigint
    ) : (
        QueryUtil.LimitNumber<this>
    );
    limit (
        maxRowCount : number|bigint
    ) : (
        | QueryUtil.LimitNumber<this>
        | QueryUtil.LimitNumber0<this>
        | QueryUtil.LimitNumber1<this>
        | QueryUtil.LimitNumber0Or1<this>
    ) {
        return QueryUtil.limit<this>(this, maxRowCount);
    }

    offset<
        OffsetT extends bigint
    > (
        offset : OffsetT
    ) : (
        QueryUtil.OffsetBigInt<this, OffsetT>
    );
    offset (
        offset : number|bigint
    ) : (
        QueryUtil.OffsetNumber<this>
    );
    offset (
        offset : number|bigint
    ) : (
        QueryUtil.OffsetNumber<this>
    ) {
        return QueryUtil.offset<this>(this, offset);
    }

    compoundQueryLimit<
        MaxRowCountT extends bigint
    > (
        maxRowCount : MaxRowCountT
    ) : (
        QueryUtil.CompoundQueryLimitBigInt<this, MaxRowCountT>
    );
    compoundQueryLimit (
        maxRowCount : 0
    ) : (
        QueryUtil.CompoundQueryLimitNumber0<this>
    );
    compoundQueryLimit (
        maxRowCount : 1
    ) : (
        QueryUtil.CompoundQueryLimitNumber1<this>
    );
    compoundQueryLimit (
        maxRowCount : 0|1
    ) : (
        QueryUtil.CompoundQueryLimitNumber0Or1<this>
    );
    compoundQueryLimit (
        maxRowCount : number|bigint
    ) : (
        QueryUtil.CompoundQueryLimitNumber<this>
    );
    compoundQueryLimit (
        maxRowCount : number|bigint
    ) : (
        | QueryUtil.CompoundQueryLimitNumber0<this>
        | QueryUtil.CompoundQueryLimitNumber1<this>
        | QueryUtil.CompoundQueryLimitNumber0Or1<this>
        | QueryUtil.CompoundQueryLimitNumber<this>
    ) {
        return QueryUtil.compoundQueryLimit<this>(this, maxRowCount);
    }

    compoundQueryOffset<
        OffsetT extends bigint
    > (
        offset : OffsetT
    ) : (
        QueryUtil.CompoundQueryOffsetBigInt<this, OffsetT>
    );
    compoundQueryOffset (
        offset : number|bigint
    ) : (
        QueryUtil.CompoundQueryOffsetNumber<this>
    );
    compoundQueryOffset (
        offset : number|bigint
    ) : (
        QueryUtil.CompoundQueryOffsetNumber<this>
    ) {
        return QueryUtil.compoundQueryOffset<this>(this, offset);
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

    groupBy (
        this : Extract<this, QueryUtil.AfterFromClause>,
        groupByDelegate : GroupByDelegate<
            Extract<this, QueryUtil.AfterFromClause>["fromClause"],
            Extract<this, QueryUtil.AfterFromClause>["selectClause"]
        >
    ) : (
        QueryUtil.GroupBy<Extract<this, QueryUtil.AfterFromClause>>
    ) {
        return QueryUtil.groupBy<
            Extract<this, QueryUtil.AfterFromClause>
        >(
            this,
            groupByDelegate
        );
    }

    having (
        havingDelegate : HavingDelegate<
            this["fromClause"]
        >
    ) : (
        QueryUtil.Having<this>
    ) {
        return QueryUtil.having<
            this
        >(
            this,
            havingDelegate
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
        eqCandidateKeyOfTableDelegate : ExprLib.EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
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
            eqCandidateKeyOfTableDelegate
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
        eqCandidateKeyOfTableDelegate : ExprLib.EqCandidateKeyOfTableDelegate<SrcT, DstT, SrcColumnsT>
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
            eqCandidateKeyOfTableDelegate
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

    orderBy (
        orderByDelegate : OrderByDelegate<
            this["fromClause"],
            this["selectClause"]
        >
    ) : (
        QueryUtil.OrderBy<this>
    ) {
        return QueryUtil.orderBy<
            this
        >(
            this,
            orderByDelegate
        );
    }

    selectValue<
        RawExprT extends AnyRawExpr
    > (
        this : Extract<this, QueryUtil.BeforeCompoundQueryClause>,
        selectValueDelegate : QueryUtil.QuerySelectValueDelegate<
            Extract<this, QueryUtil.BeforeCompoundQueryClause>,
            RawExprT
        >
    ) : (
        QueryUtil.SelectValue<
            Extract<this, QueryUtil.BeforeCompoundQueryClause>,
            RawExprT
        >
    ) {
        return QueryUtil.selectValue<
            Extract<this, QueryUtil.BeforeCompoundQueryClause>,
            RawExprT
        >(
            this,
            selectValueDelegate
        );
    }

    select<
        SelectsT extends SelectClause
    > (
        this : Extract<this, QueryUtil.BeforeCompoundQueryClause>,
        selectDelegate : QueryUtil.QuerySelectDelegate<
            Extract<this, QueryUtil.BeforeCompoundQueryClause>,
            SelectsT
        >
    ) : (
        QueryUtil.Select<
            Extract<this, QueryUtil.BeforeCompoundQueryClause>,
            SelectsT
        >
    ) {
        return QueryUtil.select<
            Extract<this, QueryUtil.BeforeCompoundQueryClause>,
            SelectsT
        >(this, selectDelegate);
    }

    compoundQueryOrderBy (
        this : Extract<this, QueryUtil.AfterSelectClause>,
        compoundQueryOrderByDelegate : CompoundQueryOrderByDelegate<
            Extract<this, QueryUtil.AfterSelectClause>["selectClause"]
        >
    ) : (
        QueryUtil.CompoundQueryOrderBy<Extract<this, QueryUtil.AfterSelectClause>>
    ) {
        return QueryUtil.compoundQueryOrderBy<
            Extract<this, QueryUtil.AfterSelectClause>
        >(
            this,
            compoundQueryOrderByDelegate
        );
    }

    unionDistinct<
        TargetQueryT extends QueryBaseUtil.AfterSelectClause
    > (
        this : Extract<this, QueryUtil.AfterSelectClause>,
        targetQuery : (
            & TargetQueryT
            & CompoundQueryClauseUtil.AssertCompatible<
                Extract<this, QueryUtil.AfterSelectClause>["fromClause"],
                Extract<this, QueryUtil.AfterSelectClause>["selectClause"],
                TargetQueryT
            >
        )
    ) : (
        QueryUtil.CompoundQuery<Extract<this, QueryUtil.AfterSelectClause>, TargetQueryT>
    ) {
        return QueryUtil.compoundQuery<
            Extract<this, QueryUtil.AfterSelectClause>,
            TargetQueryT
        >(
            this,
            CompoundQueryType.UNION,
            true,
            targetQuery
        );
    }

    unionAll<
        TargetQueryT extends QueryBaseUtil.AfterSelectClause
    > (
        this : Extract<this, QueryUtil.AfterSelectClause>,
        targetQuery : (
            & TargetQueryT
            & CompoundQueryClauseUtil.AssertCompatible<
                Extract<this, QueryUtil.AfterSelectClause>["fromClause"],
                Extract<this, QueryUtil.AfterSelectClause>["selectClause"],
                TargetQueryT
            >
        )
    ) : (
        QueryUtil.CompoundQuery<Extract<this, QueryUtil.AfterSelectClause>, TargetQueryT>
    ) {
        return QueryUtil.compoundQuery<
            Extract<this, QueryUtil.AfterSelectClause>,
            TargetQueryT
        >(
            this,
            CompoundQueryType.UNION,
            false,
            targetQuery
        );
    }

    whereEqCandidateKey<
        TableT extends JoinArrayUtil.ExtractWithCandidateKey<
            Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        /**
         * This construction effectively makes it impossible for `WhereEqCandidateKeyDelegate<>`
         * to return a union type.
         *
         * This is unfortunate but a necessary compromise for now.
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
         */
        ...args : (
            TableT extends JoinArrayUtil.ExtractWithCandidateKey<Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]> ?
            [
                FromClauseUtil.WhereEqCandidateKeyDelegate<Extract<this, QueryUtil.AfterFromClause>["fromClause"], TableT>,
                TypeUtil.StrictUnion<CandidateKey_NonUnion<TableT>>
            ] :
            never
        )
    ) : (
        QueryUtil.WhereEqCandidateKey<Extract<this, QueryUtil.AfterFromClause>>
    ) {
        return QueryUtil.whereEqCandidateKey<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT
        >(
            this,
            ...args
        );
    }

    whereEqColumns<
        TableT extends Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"][number]
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        /**
         * This construction effectively makes it impossible for `WhereEqColumnsDelegate<>`
         * to return a union type.
         *
         * This is unfortunate but a necessary compromise for now.
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
         */
        ...args : (
            TableT extends Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"][number] ?
            [
                FromClauseUtil.WhereEqColumnsDelegate<Extract<this, QueryUtil.AfterFromClause>["fromClause"], TableT>,
                PartialRow_NonUnion<TableT>
            ] :
            never
        )
    ) : (
        QueryUtil.WhereEqColumns<Extract<this, QueryUtil.AfterFromClause>>
    ) {
        return QueryUtil.whereEqColumns<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT
        >(
            this,
            ...args
        );
    }

    whereEqOuterQueryPrimaryKey<
        SrcT extends Extract<this, QueryUtil.Correlated & QueryUtil.AfterFromClause>["fromClause"]["currentJoins"][number],
        DstT extends JoinArrayUtil.ExtractWithNullSafeComparablePrimaryKey<
            Extract<this, QueryUtil.Correlated & QueryUtil.AfterFromClause>["fromClause"]["outerQueryJoins"],
            SrcT["columns"]
        >
    > (
        this : Extract<this, QueryUtil.Correlated & QueryUtil.AfterFromClause>,
        /**
         * This construction effectively makes it impossible for
         * `WhereEqOuterQueryPrimaryKeySrcDelegate<>`
         * to return a union type.
         *
         * This is unfortunate but a necessary compromise for now.
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
         */
        srcDelegate : (
            SrcT extends Extract<this, QueryUtil.Correlated & QueryUtil.AfterFromClause>["fromClause"]["currentJoins"][number] ?
            (
                FromClauseUtil.WhereEqOuterQueryPrimaryKeySrcDelegate<
                    Extract<this, QueryUtil.Correlated & QueryUtil.AfterFromClause>["fromClause"],
                    SrcT
                >
            ) :
            never
        ),
        dstDelegate : (
            FromClauseUtil.WhereEqOuterQueryPrimaryKeyDstDelegate<
                Extract<this, QueryUtil.Correlated & QueryUtil.AfterFromClause>["fromClause"],
                SrcT,
                DstT
            >
        )
    ) : (
        QueryUtil.WhereEqOuterQueryPrimaryKey<Extract<this, QueryUtil.Correlated & QueryUtil.AfterFromClause>>
    ) {
        return QueryUtil.whereEqOuterQueryPrimaryKey<
            Extract<this, QueryUtil.Correlated & QueryUtil.AfterFromClause>,
            SrcT,
            DstT
        >(
            this,
            srcDelegate,
            dstDelegate
        );
    }

    whereEqPrimaryKey<
        TableT extends JoinArrayUtil.ExtractWithPrimaryKey<
            Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        /**
         * This construction effectively makes it impossible for `WhereEqPrimaryKeyDelegate<>`
         * to return a union type.
         *
         * This is unfortunate but a necessary compromise for now.
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
         */
        ...args : (
            TableT extends JoinArrayUtil.ExtractWithPrimaryKey<Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]> ?
            [
                FromClauseUtil.WhereEqPrimaryKeyDelegate<Extract<this, QueryUtil.AfterFromClause>["fromClause"], TableT>,
                PrimaryKey_NonUnion<TableT>
            ] :
            never
        )
    ) : (
        QueryUtil.WhereEqPrimaryKey<Extract<this, QueryUtil.AfterFromClause>>
    ) {
        return QueryUtil.whereEqPrimaryKey<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT
        >(
            this,
            ...args
        );
    }

    whereEqSuperKey<
        TableT extends JoinArrayUtil.ExtractWithCandidateKey<
            Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        /**
         * This construction effectively makes it impossible for `WhereEqSuperKeyDelegate<>`
         * to return a union type.
         *
         * This is unfortunate but a necessary compromise for now.
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
         */
        ...args : (
            TableT extends JoinArrayUtil.ExtractWithCandidateKey<Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]> ?
            [
                FromClauseUtil.WhereEqSuperKeyDelegate<Extract<this, QueryUtil.AfterFromClause>["fromClause"], TableT>,
                SuperKey_NonUnion<TableT>
            ] :
            never
        )
    ) : (
        QueryUtil.WhereEqSuperKey<Extract<this, QueryUtil.AfterFromClause>>
    ) {
        return QueryUtil.whereEqSuperKey<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT
        >(
            this,
            ...args
        );
    }

    whereEq<
        ColumnT extends ColumnUtil.ExtractWithType<
            ColumnUtil.FromJoinArray<
                Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]
            >,
            NonNullPrimitiveExpr
        >,
        ValueT extends tm.OutputOf<ColumnT["mapper"]>
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        /**
         * This construction effectively makes it impossible for `WhereEqDelegate<>`
         * to return a union type.
         *
         * This is unfortunate but a necessary compromise for now.
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
         */
        ...args : (
            ColumnT extends ColumnUtil.ExtractWithType<
                ColumnUtil.FromJoinArray<Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]>,
                NonNullPrimitiveExpr
            > ?
            [
                FromClauseUtil.WhereEqDelegate<Extract<this, QueryUtil.AfterFromClause>["fromClause"], ColumnT>,
                ValueT
            ] :
            never
        )
    ) : (
        QueryUtil.WhereEq<Extract<this, QueryUtil.AfterFromClause>, ColumnT, ValueT>
    ) {
        return QueryUtil.whereEq<
            Extract<this, QueryUtil.AfterFromClause>,
            ColumnT,
            ValueT
        >(
            this,
            ...args
        );
    }

    whereIsNotNull<
        ColumnT extends ColumnUtil.ExtractNullable<
            ColumnUtil.FromJoinArray<
                Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]
            >
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        whereIsNotNullDelegate : FromClauseUtil.WhereIsNotNullDelegate<
            Extract<this, QueryUtil.AfterFromClause>["fromClause"],
            ColumnT
        >
    ) : (
        QueryUtil.WhereIsNotNull<
            Extract<this, QueryUtil.AfterFromClause>,
            ColumnT
        >
    ) {
        return QueryUtil.whereIsNotNull<
            Extract<this, QueryUtil.AfterFromClause>,
            ColumnT
        >(
            this,
            whereIsNotNullDelegate
        );
    }

    whereIsNull<
        ColumnT extends ColumnUtil.ExtractNullable<
            ColumnUtil.FromJoinArray<
                Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]
            >
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        whereIsNullDelegate : FromClauseUtil.WhereIsNullDelegate<
            Extract<this, QueryUtil.AfterFromClause>["fromClause"],
            ColumnT
        >
    ) : (
        QueryUtil.WhereIsNull<
            Extract<this, QueryUtil.AfterFromClause>,
            ColumnT
        >
    ) {
        return QueryUtil.whereIsNull<
            Extract<this, QueryUtil.AfterFromClause>,
            ColumnT
        >(
            this,
            whereIsNullDelegate
        );
    }

    whereNullSafeEq<
        ColumnT extends ColumnUtil.ExtractWithType<
            ColumnUtil.FromJoinArray<
                Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]
            >,
            PrimitiveExpr
        >,
        ValueT extends tm.OutputOf<ColumnT["mapper"]>|null
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        /**
         * This construction effectively makes it impossible for `WhereNullSafeEqDelegate<>`
         * to return a union type.
         *
         * This is unfortunate but a necessary compromise for now.
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520199818
         *
         * https://github.com/microsoft/TypeScript/issues/32804#issuecomment-520201877
         */
        ...args : (
            ColumnT extends ColumnUtil.ExtractWithType<
                ColumnUtil.FromJoinArray<Extract<this, QueryUtil.AfterFromClause>["fromClause"]["currentJoins"]>,
                PrimitiveExpr
            > ?
            [
                FromClauseUtil.WhereNullSafeEqDelegate<Extract<this, QueryUtil.AfterFromClause>["fromClause"], ColumnT>,
                ValueT
            ] :
            never
        )
    ) : (
        QueryUtil.WhereNullSafeEq<Extract<this, QueryUtil.AfterFromClause>, ColumnT, ValueT>
    ) {
        return QueryUtil.whereNullSafeEq<
            Extract<this, QueryUtil.AfterFromClause>,
            ColumnT,
            ValueT
        >(
            this,
            ...args
        );
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

    as<
        AliasT extends string
    > (
        this : Extract<this, QueryUtil.AfterSelectClause>,
        alias : AliasT & QueryBaseUtil.AssertAliasable<Extract<this, QueryUtil.AfterSelectClause>>
    ) : (
        QueryBaseUtil.As<Extract<this, QueryUtil.AfterSelectClause>, AliasT>
    ) {
        return QueryBaseUtil.as<
            Extract<this, QueryUtil.AfterSelectClause>,
            AliasT
        >(
            this,
            alias
        );
    }

    correlate () : QueryUtil.Correlate<this> {
        return QueryUtil.correlate<this>(this);
    }

    /**
     * @todo Maybe implement `selectDistinct()` as a convenience method?
     */
    distinct () : QueryUtil.Distinct<this> {
        return QueryUtil.distinct<this>(this);
    }

    /**
     * Convenience method for,
     * ```ts
     *  tsql.coalesce(myQuery.limit(1), myDefaultValue);
     * ```
     *
     * Usage,
     * ```ts
     *  myQuery.limit(1).coalesce(myDefaultValue);
     * ```
     */
    coalesce<
        DefaultValueT extends AnyRawExpr
    > (
        this : Extract<this, AnySubqueryExpr>,
        defaultValue : DefaultValueT
    ) : (
        QueryBaseUtil.Coalesce<
            Extract<this, AnySubqueryExpr>,
            DefaultValueT
        >
    ) {
        return QueryBaseUtil.coalesce<
            Extract<this, AnySubqueryExpr>,
            DefaultValueT
        >(
            this,
            defaultValue
        );
    }

    map<
        NxtReturnT
    > (
        this : Extract<this, QueryUtil.AfterSelectClause & QueryUtil.NonCorrelated & QueryUtil.Unmapped>,
        mapDelegate : QueryUtil.InitialMapDelegate<
            Extract<this, QueryUtil.AfterSelectClause & QueryUtil.NonCorrelated & QueryUtil.Unmapped>,
            NxtReturnT
        >
    ) : (
        QueryUtil.MapInitial<
            Extract<this, QueryUtil.AfterSelectClause & QueryUtil.NonCorrelated & QueryUtil.Unmapped>,
            NxtReturnT
        >
    );
    map<
        NxtReturnT
    > (
        this : Extract<this, QueryUtil.AfterSelectClause & QueryUtil.NonCorrelated & QueryUtil.Mapped>,
        mapDelegate : QueryUtil.ComposedMapDelegate<
            Extract<this, QueryUtil.AfterSelectClause & QueryUtil.NonCorrelated & QueryUtil.Mapped>,
            NxtReturnT
        >
    ) : (
        QueryUtil.MapCompose<
            Extract<this, QueryUtil.AfterSelectClause & QueryUtil.NonCorrelated & QueryUtil.Mapped>,
            NxtReturnT
        >
    );
    map (mapDelegate : MapDelegate<any, any, any>) : any {
        if (this.mapDelegate == undefined) {
            return QueryUtil.mapInitial<
                Extract<this, QueryUtil.AfterSelectClause & QueryUtil.NonCorrelated & QueryUtil.Unmapped>,
                any
            >(
                this as any,
                mapDelegate
            );
        } else {
            return QueryUtil.mapCompose<
                Extract<this, QueryUtil.AfterSelectClause & QueryUtil.NonCorrelated & QueryUtil.Mapped>,
                any
            >(
                this as any,
                mapDelegate
            );
        }
    }

    fetchAllMapped(
        this : Extract<
            this,
            (
                & QueryBaseUtil.AfterSelectClause
                & QueryBaseUtil.NonCorrelated
                & QueryBaseUtil.Mapped
            )
        >,
        connection : IsolableSelectConnection
    ) : (
        Promise<ExecutionUtil.MappedResultSet<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                    & QueryBaseUtil.Mapped
                )
            >
        >>
    ) {
        return ExecutionUtil.fetchAllMapped(this, connection);
    }

    fetchAllUnmappedFlattened(
        this : Extract<
            this,
            (
                & QueryBaseUtil.AfterSelectClause
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : SelectConnection
    ) : (
        Promise<ExecutionUtil.UnmappedFlattenedResultSet<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                )
            >
        >>
    ) {
        return ExecutionUtil.fetchAllUnmappedFlattened(this, connection);
    }

    fetchAllUnmapped(
        this : Extract<
            this,
            (
                & QueryBaseUtil.AfterSelectClause
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : SelectConnection
    ) : (
        Promise<ExecutionUtil.UnmappedResultSet<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                )
            >
        >>
    ) {
        return ExecutionUtil.fetchAllUnmapped(this, connection);
    }

    fetchAll (
        this : Extract<
            this,
            (
                & QueryBaseUtil.AfterSelectClause
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : ExecutionUtil.FetchAllConnection<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                )
            >
        >
    ) : (
        Promise<ExecutionUtil.FetchedResultSet<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                )
            >
        >>
    ) {
        return ExecutionUtil.fetchAll(this, connection);
    }

    fetchOneOrUndefined (
        this : Extract<
            this,
            (
                & QueryBaseUtil.AfterSelectClause
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : ExecutionUtil.FetchAllConnection<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                )
            >
        >
    ) : (
        Promise<
            | undefined
            | ExecutionUtil.FetchedRow<
                Extract<
                    this,
                    (
                        & QueryBaseUtil.AfterSelectClause
                        & QueryBaseUtil.NonCorrelated
                    )
                >
            >
        >
    ) {
        return ExecutionUtil.fetchOneOrUndefined(this, connection);
    }

    fetchOneOr<DefaultValueT> (
        this : Extract<
            this,
            (
                & QueryBaseUtil.AfterSelectClause
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : ExecutionUtil.FetchAllConnection<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                )
            >
        >,
        defaultValue : DefaultValueT
    ) : (
        Promise<
            | DefaultValueT
            | ExecutionUtil.FetchedRow<
                Extract<
                    this,
                    (
                        & QueryBaseUtil.AfterSelectClause
                        & QueryBaseUtil.NonCorrelated
                    )
                >
            >
        >
    ) {
        return ExecutionUtil.fetchOneOr(this, connection, defaultValue);
    }

    fetchOne (
        this : Extract<
            this,
            (
                & QueryBaseUtil.AfterSelectClause
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : ExecutionUtil.FetchAllConnection<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                )
            >
        >
    ) : (
        Promise<
            ExecutionUtil.FetchedRow<
                Extract<
                    this,
                    (
                        & QueryBaseUtil.AfterSelectClause
                        & QueryBaseUtil.NonCorrelated
                    )
                >
            >
        >
    ) {
        return ExecutionUtil.fetchOne(this, connection);
    }

    fetchValueArray(
        this : Extract<
            this,
            (
                & QueryBaseUtil.OneSelectItem<any>
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : SelectConnection
    ) : (
        Promise<
            QueryBaseUtil.TypeOfSelectItem<
                Extract<
                    this,
                    (
                        & QueryBaseUtil.OneSelectItem<any>
                        & QueryBaseUtil.NonCorrelated
                    )
                >
            >[]
        >
    ) {
        return ExecutionUtil.fetchValueArray(this, connection);
    }

    fetchValueOrUndefined (
        this : Extract<
            this,
            (
                & QueryBaseUtil.OneSelectItem<any>
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : SelectConnection
    ) : (
        Promise<
            | undefined
            | QueryBaseUtil.TypeOfSelectItem<
                Extract<
                    this,
                    (
                        & QueryBaseUtil.OneSelectItem<any>
                        & QueryBaseUtil.NonCorrelated
                    )
                >
            >
        >
    ) {
        return ExecutionUtil.fetchValueOrUndefined(this, connection);
    }

    fetchValueOr<DefaultValueT> (
        this : Extract<
            this,
            (
                & QueryBaseUtil.OneSelectItem<any>
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : SelectConnection,
        defaultValue : DefaultValueT
    ) : (
        Promise<
            | DefaultValueT
            | QueryBaseUtil.TypeOfSelectItem<
                Extract<
                    this,
                    (
                        & QueryBaseUtil.OneSelectItem<any>
                        & QueryBaseUtil.NonCorrelated
                    )
                >
            >
        >
    ) {
        return ExecutionUtil.fetchValueOr(this, connection, defaultValue);
    }

    fetchValue (
        this : Extract<
            this,
            (
                & QueryBaseUtil.OneSelectItem<any>
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : SelectConnection
    ) : (
        Promise<
            QueryBaseUtil.TypeOfSelectItem<
                Extract<
                    this,
                    (
                        & QueryBaseUtil.OneSelectItem<any>
                        & QueryBaseUtil.NonCorrelated
                    )
                >
            >
        >
    ) {
        return ExecutionUtil.fetchValue(this, connection);
    }

    count (
        this : Extract<this, QueryBaseUtil.NonCorrelated>,
        connection : SelectConnection
    ) : Promise<bigint> {
        return ExecutionUtil.count(this, connection);
    }

    paginate(
        this : Extract<
            this,
            (
                & QueryBaseUtil.AfterSelectClause
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : ExecutionUtil.FetchAllConnection<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                )
            >
        >,
        rawArgs : ExecutionUtil.RawPaginateArgs
    ) : (
        Promise<
            ExecutionUtil.Paginate<
                Extract<
                    this,
                    (
                        & QueryBaseUtil.AfterSelectClause
                        & QueryBaseUtil.NonCorrelated
                    )
                >
            >
        >
    ) {
        return ExecutionUtil.paginate(this, connection, rawArgs);
    }

    exists (
        this : Extract<this, QueryUtil.NonCorrelated & (QueryUtil.AfterFromClause|QueryUtil.AfterSelectClause)>,
        connection : SelectConnection
    ) : Promise<boolean> {
        return ExecutionUtil.exists(this, connection);
    }

    assertExists (
        this : Extract<this, QueryUtil.NonCorrelated & (QueryUtil.AfterFromClause|QueryUtil.AfterSelectClause)>,
        connection : SelectConnection
    ) : Promise<void> {
        return ExecutionUtil.assertExists(this, connection);
    }

    emulatedCursor (
        this : Extract<
            this,
            (
                & QueryBaseUtil.AfterSelectClause
                & QueryBaseUtil.NonCorrelated
            )
        >,
        connection : ExecutionUtil.FetchAllConnection<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                )
            >
        >,
        /**
         * If set, determines the starting `page` of the cursor.
         * The `rowsPerPage` setting determines how many rows are buffered into memory at a time.
         */
        rawArgs : ExecutionUtil.RawPaginateArgs = {}
    ) : (
        ExecutionUtil.EmulatedCursor<
            Extract<
                this,
                (
                    & QueryBaseUtil.AfterSelectClause
                    & QueryBaseUtil.NonCorrelated
                )
            >
        >
    ) {
        return ExecutionUtil.emulatedCursor(this, connection, rawArgs);
    }
}
