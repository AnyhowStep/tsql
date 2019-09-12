import * as tm from "type-mapping";
import {ExtraQueryData, QueryData, IQuery} from "./query";
import {WhereClause, WhereDelegate} from "../where-clause";
import {GroupByClause, GroupByDelegate} from "../group-by-clause";
import {HavingClause, HavingDelegate} from "../having-clause";
import {OrderByClause, OrderByDelegate} from "../order-by-clause";
import {IAliasedTable} from "../aliased-table";
import {FromClauseUtil} from "../from-clause";
import {SelectClause, SelectDelegate} from "../select-clause";
import {RawExpr} from "../raw-expr";
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
import {UnionOrderByClause, UnionOrderByDelegate} from "../union-order-by-clause";

export class Query<DataT extends QueryData> implements IQuery<DataT> {
    readonly fromClause : DataT["fromClause"];
    readonly selectClause : DataT["selectClause"];

    readonly limitClause : DataT["limitClause"];

    readonly compoundQueryClause : DataT["compoundQueryClause"];
    readonly compoundQueryLimitClause : DataT["compoundQueryLimitClause"];

    readonly whereClause : WhereClause|undefined;
    readonly groupByClause : GroupByClause|undefined;
    readonly havingClause : HavingClause|undefined;
    readonly orderByClause : OrderByClause|undefined;
    readonly compoundQueryOrderByClause : UnionOrderByClause|undefined;

    constructor (data : DataT, extraData : ExtraQueryData) {
        this.fromClause = data.fromClause;
        this.selectClause = data.selectClause;
        this.limitClause = data.limitClause;
        this.compoundQueryClause = data.compoundQueryClause;
        this.compoundQueryLimitClause = data.compoundQueryLimitClause;

        this.whereClause = extraData.whereClause;
        this.groupByClause = extraData.groupByClause;
        this.havingClause = extraData.havingClause;
        this.orderByClause = extraData.orderByClause;
        this.compoundQueryOrderByClause = extraData.compoundQueryOrderByClause;
    }

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
        QueryUtil.UnionLimitBigInt<this, MaxRowCountT>
    );
    compoundQueryLimit (
        maxRowCount : 0
    ) : (
        QueryUtil.UnionLimitNumber0<this>
    );
    compoundQueryLimit (
        maxRowCount : 1
    ) : (
        QueryUtil.UnionLimitNumber1<this>
    );
    compoundQueryLimit (
        maxRowCount : 0|1
    ) : (
        QueryUtil.UnionLimitNumber0Or1<this>
    );
    compoundQueryLimit (
        maxRowCount : number|bigint
    ) : (
        QueryUtil.UnionLimitNumber<this>
    );
    compoundQueryLimit (
        maxRowCount : number|bigint
    ) : (
        | QueryUtil.UnionLimitNumber0<this>
        | QueryUtil.UnionLimitNumber1<this>
        | QueryUtil.UnionLimitNumber0Or1<this>
        | QueryUtil.UnionLimitNumber<this>
    ) {
        return QueryUtil.compoundQueryLimit<this>(this, maxRowCount);
    }

    unionOffset<
        OffsetT extends bigint
    > (
        offset : OffsetT
    ) : (
        QueryUtil.UnionOffsetBigInt<this, OffsetT>
    );
    unionOffset (
        offset : number|bigint
    ) : (
        QueryUtil.UnionOffsetNumber<this>
    );
    unionOffset (
        offset : number|bigint
    ) : (
        QueryUtil.UnionOffsetNumber<this>
    ) {
        return QueryUtil.unionOffset<this>(this, offset);
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

    compoundQueryOrderBy (
        this : Extract<this, QueryUtil.AfterSelectClause>,
        compoundQueryOrderByDelegate : UnionOrderByDelegate<
            Extract<this, QueryUtil.AfterSelectClause>["selectClause"]
        >
    ) : (
        QueryUtil.UnionOrderBy<Extract<this, QueryUtil.AfterSelectClause>>
    ) {
        return QueryUtil.compoundQueryOrderBy<
            Extract<this, QueryUtil.AfterSelectClause>
        >(
            this,
            compoundQueryOrderByDelegate
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
}
