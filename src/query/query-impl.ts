import {IJoin} from "../join";
import {IAliasedTable} from "../aliased-table";
import {SelectItem} from "../select-item";
import {IAnonymousTypedExpr} from "../expr";
import * as QueryUtil from "./util";
import {ColumnIdentifier} from "../column-identifier";
import {Order} from "../order";
import {MapDelegate} from "../map-delegate";
import {DISTINCT} from "../constants";
import {NonEmptyTuple} from "../tuple";
import {ITable, TableWithPk} from "../table";
import {RawExpr, RawExprUtil} from "../raw-expr";
import {PrimitiveExpr, NonNullPrimitiveExpr} from "../primitive-expr";
import {IJoinDeclaration} from "../join-declaration";
import {IConnection} from "../execution";
import {InsertSelectRowDelegate} from "../insert-select";
import {UpdateUtil, UpdatableQuery} from "../update";
import {DeletableQuery, DeleteUtil, Delete, DeleteModifier} from "../delete";
import {Row} from "../row";
import {CandidateKey} from "../candidate-key";
import {PrimaryKey} from "../primary-key";
import {QueryData, IQuery} from "./query";

export class Query<DataT extends QueryData> implements IQuery<DataT> {
    readonly _distinct : DataT["_distinct"];
    readonly _sqlCalcFoundRows : DataT["_sqlCalcFoundRows"];

    readonly _joins : DataT["_joins"];
    readonly _parentJoins : DataT["_parentJoins"];
    readonly _selects : DataT["_selects"];
    readonly _where : DataT["_where"];

    readonly _grouped : DataT["_grouped"];
    readonly _having : DataT["_having"];

    readonly _orders : DataT["_orders"];
    readonly _limit : DataT["_limit"];

    readonly _unions : DataT["_unions"];
    readonly _unionOrders : DataT["_unionOrders"];
    readonly _unionLimit : DataT["_unionLimit"];

    readonly _mapDelegate : DataT["_mapDelegate"];

    constructor (data : DataT) {
        this._distinct = data._distinct;
        this._sqlCalcFoundRows = data._sqlCalcFoundRows;

        this._joins = data._joins;
        this._parentJoins = data._parentJoins;
        this._selects = data._selects;
        this._where = data._where;

        this._grouped = data._grouped;
        this._having = data._having;

        this._orders = data._orders;
        this._limit = data._limit;

        this._unions = data._unions;
        this._unionOrders = data._unionOrders;
        this._unionLimit = data._unionLimit;

        this._mapDelegate = data._mapDelegate;
    }

    from<
        AliasedTableT extends IAliasedTable
    > (
        this : Extract<this, QueryUtil.BeforeFromClause>,
        aliasedTable : QueryUtil.AssertValidJoinTarget<
            Extract<this, QueryUtil.BeforeFromClause>,
            AliasedTableT
        >
    ) : (
        QueryUtil.From<
            Extract<this, QueryUtil.BeforeFromClause>,
            AliasedTableT
        >
    ) {
        return QueryUtil.from<
            Extract<this, QueryUtil.BeforeFromClause>,
            AliasedTableT
        >(
            this,
            aliasedTable
        );
    }

    innerJoin<
        AliasedTableT extends IAliasedTable,
        FromDelegateT extends QueryUtil.JoinFromDelegate<
            Extract<this, QueryUtil.AfterFromClause>["_joins"]
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        aliasedTable : QueryUtil.AssertValidJoinTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >,
        fromDelegate : FromDelegateT,
        toDelegate : QueryUtil.JoinToDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT,
            FromDelegateT
        >
    ) : (
        QueryUtil.InnerJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >
    ) {
        return QueryUtil.innerJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT,
            FromDelegateT
        >(
            this,
            aliasedTable,
            fromDelegate,
            toDelegate
        );
    }
    leftJoin<
        AliasedTableT extends IAliasedTable,
        FromDelegateT extends QueryUtil.JoinFromDelegate<
            Extract<this, QueryUtil.AfterFromClause>["_joins"]
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        aliasedTable : QueryUtil.AssertValidJoinTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >,
        fromDelegate : FromDelegateT,
        toDelegate : QueryUtil.JoinToDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT,
            FromDelegateT
        >
    ) : (
        QueryUtil.LeftJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >
    ) {
        return QueryUtil.leftJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT,
            FromDelegateT
        >(
            this,
            aliasedTable,
            fromDelegate,
            toDelegate
        );
    }
    rightJoin<
        AliasedTableT extends IAliasedTable,
        FromDelegateT extends QueryUtil.JoinFromDelegate<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >["_joins"]
        >
    > (
        this : Extract<
            this,
            QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
        >,
        aliasedTable : QueryUtil.AssertValidJoinTarget<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            AliasedTableT
        >,
        fromDelegate : FromDelegateT,
        toDelegate : QueryUtil.JoinToDelegate<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            AliasedTableT,
            FromDelegateT
        >
    ) : (
        QueryUtil.RightJoin<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            AliasedTableT
        >
    ) {
        return QueryUtil.rightJoin<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            AliasedTableT,
            FromDelegateT
        >(
            this,
            aliasedTable,
            fromDelegate,
            toDelegate
        );
    }

    innerJoinUsing<
        AliasedTableT extends IAliasedTable,
        UsingDelegateT extends QueryUtil.JoinUsingDelegate<
            Extract<this, QueryUtil.AfterFromClause>["_joins"],
            AliasedTableT
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        aliasedTable : QueryUtil.AssertValidJoinTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >,
        usingDelegate : UsingDelegateT
    ) : (
        QueryUtil.InnerJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >
    ) {
        return QueryUtil.innerJoinUsing<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT,
            UsingDelegateT
        >(
            this,
            aliasedTable,
            usingDelegate
        );
    }

    leftJoinUsing<
        AliasedTableT extends IAliasedTable,
        UsingDelegateT extends QueryUtil.JoinUsingDelegate<
            Extract<this, QueryUtil.AfterFromClause>["_joins"],
            AliasedTableT
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        aliasedTable : QueryUtil.AssertValidJoinTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >,
        usingDelegate : UsingDelegateT
    ) : (
        QueryUtil.LeftJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >
    ) {
        return QueryUtil.leftJoinUsing<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT,
            UsingDelegateT
        >(
            this,
            aliasedTable,
            usingDelegate
        );
    }

    rightJoinUsing<
        AliasedTableT extends IAliasedTable,
        UsingDelegateT extends QueryUtil.JoinUsingDelegate<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >["_joins"],
            AliasedTableT
        >
    > (
        this : Extract<
            this,
            QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
        >,
        aliasedTable : QueryUtil.AssertValidJoinTarget<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            AliasedTableT
        >,
        usingDelegate : UsingDelegateT
    ) : (
        QueryUtil.RightJoin<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            AliasedTableT
        >
    ) {
        return QueryUtil.rightJoinUsing<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            AliasedTableT,
            UsingDelegateT
        >(
            this,
            aliasedTable,
            usingDelegate
        );
    }

    innerJoinCk<
        TableT extends ITable,
        FromDelegateT extends QueryUtil.JoinFromDelegate<
            Extract<this, QueryUtil.AfterFromClause>["_joins"]
        >,
        ToDelegateT extends QueryUtil.JoinToDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT,
            FromDelegateT
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        table : QueryUtil.AssertValidJoinTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT
        >,
        fromDelegate : FromDelegateT,
        toDelegate : ToDelegateT
    ) : (
        QueryUtil.AssertValidJoinCkDelegate_Hack<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT,
            FromDelegateT,
            ToDelegateT,
            QueryUtil.InnerJoin<
                Extract<this, QueryUtil.AfterFromClause>,
                TableT
            >
        >
    ) {
        return QueryUtil.innerJoinCk<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT,
            FromDelegateT,
            ToDelegateT
        >(
            this,
            table,
            fromDelegate,
            toDelegate
        );
    }

    leftJoinCk<
        TableT extends ITable,
        FromDelegateT extends QueryUtil.JoinFromDelegate<
            Extract<this, QueryUtil.AfterFromClause>["_joins"]
        >,
        ToDelegateT extends QueryUtil.JoinToDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT,
            FromDelegateT
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        table : QueryUtil.AssertValidJoinTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT
        >,
        fromDelegate : FromDelegateT,
        toDelegate : ToDelegateT
    ) : (
        QueryUtil.AssertValidJoinCkDelegate_Hack<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT,
            FromDelegateT,
            ToDelegateT,
            QueryUtil.LeftJoin<
                Extract<this, QueryUtil.AfterFromClause>,
                TableT
            >
        >
    ) {
        return QueryUtil.leftJoinCk<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT,
            FromDelegateT,
            ToDelegateT
        >(
            this,
            table,
            fromDelegate,
            toDelegate
        );
    }

    rightJoinCk<
        TableT extends ITable,
        FromDelegateT extends QueryUtil.JoinFromDelegate<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >["_joins"]
        >,
        ToDelegateT extends QueryUtil.JoinToDelegate<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            TableT,
            FromDelegateT
        >
    > (
        this : Extract<
            this,
            QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
        >,
        table : QueryUtil.AssertValidJoinTarget<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            TableT
        >,
        fromDelegate : FromDelegateT,
        toDelegate : ToDelegateT
    ) : (
        QueryUtil.AssertValidJoinCkDelegate_Hack<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            TableT,
            FromDelegateT,
            ToDelegateT,
                QueryUtil.RightJoin<
                    Extract<
                    this,
                    QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
                >,
                TableT
            >
        >
    ) {
        return QueryUtil.rightJoinCk<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            TableT,
            FromDelegateT,
            ToDelegateT
        >(
            this,
            table,
            fromDelegate,
            toDelegate
        );
    }

    innerJoinCkUsing<
        TableT extends ITable,
        UsingDelegateT extends QueryUtil.JoinUsingDelegate<
            Extract<this, QueryUtil.AfterFromClause>["_joins"],
            TableT
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        table : QueryUtil.AssertValidJoinTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT
        >,
        usingDelegate : UsingDelegateT
    ) : (
        QueryUtil.AssertValidJoinCkUsingDelegate_Hack<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT,
            UsingDelegateT,
            QueryUtil.InnerJoin<
                Extract<this, QueryUtil.AfterFromClause>,
                TableT
            >
        >
    ) {
        return QueryUtil.innerJoinCkUsing<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT,
            UsingDelegateT
        >(
            this,
            table,
            usingDelegate
        );
    }

    leftJoinCkUsing<
        TableT extends ITable,
        UsingDelegateT extends QueryUtil.JoinUsingDelegate<
            Extract<this, QueryUtil.AfterFromClause>["_joins"],
            TableT
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        table : QueryUtil.AssertValidJoinTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT
        >,
        usingDelegate : UsingDelegateT
    ) : (
        QueryUtil.AssertValidJoinCkUsingDelegate_Hack<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT,
            UsingDelegateT,
            QueryUtil.LeftJoin<
                Extract<this, QueryUtil.AfterFromClause>,
                TableT
            >
        >
    ) {
        return QueryUtil.leftJoinCkUsing<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT,
            UsingDelegateT
        >(
            this,
            table,
            usingDelegate
        );
    }

    rightJoinCkUsing<
        TableT extends ITable,
        UsingDelegateT extends QueryUtil.JoinUsingDelegate<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >["_joins"],
            TableT
        >
    > (
        this : Extract<
            this,
            QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
        >,
        table : QueryUtil.AssertValidJoinTarget<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            TableT
        >,
        usingDelegate : UsingDelegateT
    ) : (
        QueryUtil.AssertValidJoinCkUsingDelegate_Hack<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            TableT,
            UsingDelegateT,
            QueryUtil.RightJoin<
                Extract<
                    this,
                    QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
                >,
                TableT
            >
        >
    ) {
        return QueryUtil.rightJoinCkUsing<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            TableT,
            UsingDelegateT
        >(
            this,
            table,
            usingDelegate
        );
    }

    innerJoinPk<
        DelegateT extends QueryUtil.JoinPkDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >,
        ToTableT extends ITable & { primaryKey : string[] },
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : DelegateT,
        toTable : QueryUtil.AssertValidJoinPk_FromDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ToTableT
        >
    ) : (
        QueryUtil.InnerJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            ToTableT
        >
    ) {
        return QueryUtil.innerJoinPk<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ToTableT
        >(
            this,
            delegate,
            toTable
        );
    }

    leftJoinPk<
        DelegateT extends QueryUtil.JoinPkDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >,
        ToTableT extends ITable & { primaryKey : string[] },
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : DelegateT,
        toTable : QueryUtil.AssertValidJoinPk_FromDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ToTableT
        >
    ) : (
        QueryUtil.LeftJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            ToTableT
        >
    ) {
        return QueryUtil.leftJoinPk<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ToTableT
        >(
            this,
            delegate,
            toTable
        );
    }

    rightJoinPk<
        DelegateT extends QueryUtil.JoinPkDelegate<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >
        >,
        ToTableT extends ITable & { primaryKey : string[] },
    > (
        this : Extract<
            this,
            QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
        >,
        delegate : DelegateT,
        toTable : QueryUtil.AssertValidJoinPk_FromDelegate<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            DelegateT,
            ToTableT
        >
    ) : (
        QueryUtil.RightJoin<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            ToTableT
        >
    ) {
        return QueryUtil.rightJoinPk<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            DelegateT,
            ToTableT
        >(
            this,
            delegate,
            toTable
        );
    }

    innerJoinFromPk<
        DelegateT extends QueryUtil.JoinFromPkDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >,
        ToTableT extends IAliasedTable
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : DelegateT,
        toTable : QueryUtil.AssertValidJoinFromPk_FromDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ToTableT
        >
    ) : (
        QueryUtil.InnerJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            ToTableT
        >
    ) {
        return QueryUtil.innerJoinFromPk<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ToTableT
        >(
            this,
            delegate,
            toTable
        );
    }

    leftJoinFromPk<
        DelegateT extends QueryUtil.JoinFromPkDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >,
        ToTableT extends IAliasedTable
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : DelegateT,
        toTable : QueryUtil.AssertValidJoinFromPk_FromDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ToTableT
        >
    ) : (
        QueryUtil.LeftJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            ToTableT
        >
    ) {
        return QueryUtil.leftJoinFromPk<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ToTableT
        >(
            this,
            delegate,
            toTable
        );
    }

    rightJoinFromPk<
        DelegateT extends QueryUtil.JoinFromPkDelegate<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >
        >,
        ToTableT extends IAliasedTable
    > (
        this : Extract<
            this,
            QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
        >,
        delegate : DelegateT,
        toTable : QueryUtil.AssertValidJoinFromPk_FromDelegate<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            DelegateT,
            ToTableT
        >
    ) : (
        QueryUtil.RightJoin<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            ToTableT
        >
    ) {
        return QueryUtil.rightJoinFromPk<
            Extract<
                this,
                QueryUtil.AfterFromClause & QueryUtil.CanWidenColumnTypes
            >,
            DelegateT,
            ToTableT
        >(
            this,
            delegate,
            toTable
        );
    }

    select<
        SelectDelegateT extends QueryUtil.SelectDelegate<
            Extract<this, QueryUtil.BeforeUnionClause>
        >
    > (
        this : Extract<this, QueryUtil.BeforeUnionClause>,
        delegate : QueryUtil.AssertValidSelectDelegate<
            Extract<this, QueryUtil.BeforeUnionClause>,
            SelectDelegateT
        >
    ) : (
        QueryUtil.Select<
            Extract<this, QueryUtil.BeforeUnionClause>,
            SelectDelegateT
        >
    ) {
        return QueryUtil.select<
            Extract<this, QueryUtil.BeforeUnionClause>,
            SelectDelegateT
        >(
            this,
            delegate
        );
    }
    //Added to speed up compile-times.
    //Some complicated queries take 700+ seconds to compile!
    selectUnsafe<
        SelectDelegateT extends QueryUtil.SelectDelegate<
            Extract<this, QueryUtil.BeforeUnionClause>
        >
    > (
        this : Extract<this, QueryUtil.BeforeUnionClause>,
        delegate : SelectDelegateT
    ) : (
        QueryUtil.Select<
            Extract<this, QueryUtil.BeforeUnionClause>,
            SelectDelegateT
        >
    ) {
        return QueryUtil.select<
            Extract<this, QueryUtil.BeforeUnionClause>,
            SelectDelegateT
        >(
            this,
            delegate as any
        );
    }

    selectExpr<
        SelectDelegateT extends QueryUtil.SelectExprDelegate<
            Extract<this, QueryUtil.BeforeUnionClause & QueryUtil.BeforeSelectClause>
        >
    > (
        this : Extract<this, QueryUtil.BeforeUnionClause & QueryUtil.BeforeSelectClause>,
        delegate : QueryUtil.AssertValidSelectExprDelegate<
            Extract<this, QueryUtil.BeforeUnionClause & QueryUtil.BeforeSelectClause>,
            SelectDelegateT
        >
    ) : (
        QueryUtil.SelectExpr<
            Extract<this, QueryUtil.BeforeUnionClause & QueryUtil.BeforeSelectClause>,
            SelectDelegateT
        >
    ) {
        return QueryUtil.selectExpr<
            Extract<this, QueryUtil.BeforeUnionClause & QueryUtil.BeforeSelectClause>,
            SelectDelegateT
        >(
            this,
            delegate
        );
    }

    where<
        WhereDelegateT extends QueryUtil.WhereDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : QueryUtil.AssertValidWhereDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            WhereDelegateT
        >
    ) : QueryUtil.Where<Extract<this, QueryUtil.AfterFromClause>> {
        return QueryUtil.where<
            Extract<this, QueryUtil.AfterFromClause>,
            WhereDelegateT
        >(this, delegate);
    }

    groupBy<
        GroupByDelegateT extends QueryUtil.GroupByDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : QueryUtil.AssertValidGroupByDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            GroupByDelegateT
        >
    ) : QueryUtil.GroupBy<Extract<this, QueryUtil.AfterFromClause>> {
        return QueryUtil.groupBy<
            Extract<this, QueryUtil.AfterFromClause>,
            GroupByDelegateT
        >(this, delegate);
    }

    having<
        HavingDelegateT extends QueryUtil.HavingDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : QueryUtil.AssertValidHavingDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            HavingDelegateT
        >
    ) : QueryUtil.Having<Extract<this, QueryUtil.AfterFromClause>> {
        return QueryUtil.having<
            Extract<this, QueryUtil.AfterFromClause>,
            HavingDelegateT
        >(this, delegate);
    }

    orderBy<
        OrderByDelegateT extends QueryUtil.OrderByDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : QueryUtil.AssertValidOrderByDelegate<
            Extract<this, QueryUtil.AfterFromClause>,
            OrderByDelegateT
        >
    ) : QueryUtil.OrderBy<Extract<this, QueryUtil.AfterFromClause>> {
        return QueryUtil.orderBy<
            Extract<this, QueryUtil.AfterFromClause>,
            OrderByDelegateT
        >(this, delegate);
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
    limit<MaxRowCountT extends number> (
        maxRowCount : MaxRowCountT
    ) : QueryUtil.Limit<this, MaxRowCountT> {
        return QueryUtil.limit(this, maxRowCount);
    }
    offset<OffsetT extends number> (
        offset : OffsetT
    ) : QueryUtil.Offset<this, OffsetT> {
        return QueryUtil.offset(this, offset);
    }

    union<OtherT extends QueryUtil.AfterSelectClause>(
        this : Extract<this, QueryUtil.AfterSelectClause>,
        other : QueryUtil.AssertUnionCompatibleQuery<
            Extract<this, QueryUtil.AfterSelectClause>,
            OtherT
        >
    ) : QueryUtil.Union<Extract<this, QueryUtil.AfterSelectClause>>;
    union<OtherT extends QueryUtil.AfterSelectClause>(
        this : Extract<this, QueryUtil.AfterSelectClause>,
        unionType : QueryUtil.UnionType,
        other : QueryUtil.AssertUnionCompatibleQuery<
            Extract<this, QueryUtil.AfterSelectClause>,
            OtherT
        >
    ) : QueryUtil.Union<Extract<this, QueryUtil.AfterSelectClause>>;
    union<OtherT extends QueryUtil.AfterSelectClause> (this : Extract<this, QueryUtil.AfterSelectClause>, arg0 : any, arg1? : any) {
        if (arg1 == undefined) {
            //Only two args
            const other : QueryUtil.AssertUnionCompatibleQuery<
                Extract<this, QueryUtil.AfterSelectClause>,
                OtherT
            > = arg0;
            return QueryUtil.union<
                Extract<this, QueryUtil.AfterSelectClause>,
                OtherT
            >(this, other, DISTINCT);
        } else {
            //Three args
            //Yeap, it's arg*1*, then arg*0*.
            //Confusing. I know. I'm sorry.
            const other : QueryUtil.AssertUnionCompatibleQuery<
                Extract<this, QueryUtil.AfterSelectClause>,
                OtherT
            > = arg1;
            const unionType : QueryUtil.UnionType = arg0;
            return QueryUtil.union<
                Extract<this, QueryUtil.AfterSelectClause>,
                OtherT
            >(this, other, unionType);
        }
    }

    unionOrderBy<
        UnionOrderByDelegateT extends QueryUtil.UnionOrderByDelegate<
            Extract<this, QueryUtil.AfterSelectClause & (QueryUtil.AfterFromClause|QueryUtil.AfterUnionClause)>
        >
    > (
        this : Extract<this, QueryUtil.AfterSelectClause & (QueryUtil.AfterFromClause|QueryUtil.AfterUnionClause)>,
        delegate : QueryUtil.AssertValidUnionOrderByDelegate<
            Extract<this, QueryUtil.AfterSelectClause & (QueryUtil.AfterFromClause|QueryUtil.AfterUnionClause)>,
            UnionOrderByDelegateT
        >
    ) : QueryUtil.UnionOrderBy<
    Extract<this, QueryUtil.AfterSelectClause & (QueryUtil.AfterFromClause|QueryUtil.AfterUnionClause)>
    > {
        return QueryUtil.unionOrderBy<
            Extract<this, QueryUtil.AfterSelectClause & (QueryUtil.AfterFromClause|QueryUtil.AfterUnionClause)>,
            UnionOrderByDelegateT
        >(this, delegate);
    }

    /*
        One should be careful about using UNION LIMIT, OFFSET
        without the UNION ORDER BY clause.
    */
    unionLimit<MaxRowCountT extends number> (
        maxRowCount : MaxRowCountT
    ) : QueryUtil.UnionLimit<this, MaxRowCountT> {
        return QueryUtil.unionLimit(this, maxRowCount);
    }
    unionOffset<OffsetT extends number> (
        offset : OffsetT
    ) : QueryUtil.UnionOffset<this, OffsetT> {
        return QueryUtil.unionOffset(this, offset);
    }

    distinct (
        this : Extract<this, QueryUtil.AfterSelectClause>
    ) : QueryUtil.Distinct<Extract<this, QueryUtil.AfterSelectClause>> {
        return QueryUtil.distinct(this);
    }
    sqlCalcFoundRows (
        this : Extract<this, QueryUtil.AfterSelectClause>
    ) : QueryUtil.SqlCalcFoundRows<Extract<this, QueryUtil.AfterSelectClause>> {
        return QueryUtil.sqlCalcFoundRows(this);
    }

    crossJoin<
        AliasedTableT extends IAliasedTable
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        aliasedTable : QueryUtil.AssertValidJoinTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >
    ) : (
        QueryUtil.CrossJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >
    ) {
        return QueryUtil.crossJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            AliasedTableT
        >(
            this,
            aliasedTable
        );
    }

    requireParentJoins<
        ArrT extends NonEmptyTuple<IAliasedTable>
    > (
        ...arr : QueryUtil.AssertValidParentJoins<this, ArrT>
    ) : (
        QueryUtil.RequireParentJoins<
            this,
            false,
            ArrT
        >
    ) {
        return QueryUtil.requireParentJoins<
            this,
            false,
            ArrT
        >(
            this,
            false,
            //TODO-UNHACK Figure out what's wrong
            ...(arr as any)
        );
    }
    requireNullableParentJoins<
        ArrT extends NonEmptyTuple<IAliasedTable>
    > (
        ...arr : QueryUtil.AssertValidParentJoins<this, ArrT>
    ) : (
        QueryUtil.RequireParentJoins<
            this,
            true,
            ArrT
        >
    ) {
        return QueryUtil.requireParentJoins<
            this,
            true,
            ArrT
        >(
            this,
            true,
            //TODO-UNHACK Figure out what's wrong
            ...(arr as any)
        );
    }
    as<AliasT extends string> (
        this : QueryUtil.AssertAliasableQuery<
            Extract<this, QueryUtil.AfterSelectClause>
        >,
        alias : AliasT
    ) : (
        QueryUtil.As<
            Extract<this, QueryUtil.AfterSelectClause>,
            AliasT
        >
    ) {
        return QueryUtil.as<
            Extract<this, QueryUtil.AfterSelectClause>,
            AliasT
        >(this, alias);
    }
    coalesce<
        DefaultT extends RawExpr<RawExprUtil.TypeOf<
            Extract<this, RawExpr<PrimitiveExpr>>
        >>
    > (
        this : Extract<this, RawExpr<PrimitiveExpr>>,
        defaultExpr : DefaultT
    ) : (
        QueryUtil.Coalesce<
            Extract<this, RawExpr<PrimitiveExpr>>,
            DefaultT
        >
    ) {
        return QueryUtil.coalesce(this, defaultExpr);
    }

    map<
        DelegateT extends MapDelegate<
            QueryUtil.MappedType<
                Extract<this, QueryUtil.AfterSelectClause>
            >,
            QueryUtil.UnmappedType<
                Extract<this, QueryUtil.AfterSelectClause>
            >,
            any
        >
    > (
        this : Extract<this, QueryUtil.AfterSelectClause>,
        delegate : DelegateT
    ) : (
        QueryUtil.Map<
            Extract<this, QueryUtil.AfterSelectClause>,
            DelegateT
        >
    ) {
        return QueryUtil.map(this, delegate);
    }

    whereIsNull<
        DelegateT extends QueryUtil.WhereIsNullDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : DelegateT
    ) : (
        QueryUtil.WhereIsNull<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT
        >
    ) {
        return QueryUtil.whereIsNull<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT
        >(this, delegate)
    }

    whereIsNotNull<
        DelegateT extends QueryUtil.WhereIsNotNullDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : DelegateT
    ) : (
        QueryUtil.WhereIsNotNull<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT
        >
    ) {
        return QueryUtil.whereIsNotNull<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT
        >(this, delegate);
    }

    whereEq<
        DelegateT extends QueryUtil.WhereEqDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >,
        ValueT extends NonNullPrimitiveExpr
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : DelegateT,
        value : QueryUtil.AssertValidEqTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ValueT
        >
    ) : (
        QueryUtil.WhereEq<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ValueT
        >
    ) {
        return QueryUtil.whereEq<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ValueT
        >(this, delegate, value);
    }

    whereNullSafeEq<
        DelegateT extends QueryUtil.WhereNullSafeEqDelegate<
            Extract<this, QueryUtil.AfterFromClause>
        >,
        ValueT extends PrimitiveExpr
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        delegate : DelegateT,
        value : QueryUtil.AssertValidNullSafeEqTarget<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ValueT
        >
    ) : (
        QueryUtil.WhereNullSafeEq<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ValueT
        >
    ) {
        return QueryUtil.whereNullSafeEq<
            Extract<this, QueryUtil.AfterFromClause>,
            DelegateT,
            ValueT
        >(this, delegate, value);
    }

    //TODO Phase this out, prefer whereEqCk() instead
    whereEqCandidateKey<
        TableT extends ITable,
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        table : TableT & Extract<this, QueryUtil.AfterFromClause>["_joins"][number]["aliasedTable"],
        key : CandidateKey<TableT>
    ) : QueryUtil.WhereEqCandidateKey<Extract<this, QueryUtil.AfterFromClause>> {
        return QueryUtil.whereEqCandidateKey(
            this,
            table,
            key
        );
    }
    //Synonym for whereEqCandidateKey(), use whereEqCk() instead
    whereEqCk<
        TableT extends ITable,
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        table : TableT & Extract<this, QueryUtil.AfterFromClause>["_joins"][number]["aliasedTable"],
        key : CandidateKey<TableT>
    ) : QueryUtil.WhereEqCandidateKey<Extract<this, QueryUtil.AfterFromClause>> {
        return QueryUtil.whereEqCandidateKey(
            this,
            table,
            key
        );
    }

    whereEqColumns<
        TableT extends ITable,
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        table : TableT & Extract<this, QueryUtil.AfterFromClause>["_joins"][number]["aliasedTable"],
        columns : Partial<Row<TableT>>
    ) : QueryUtil.WhereEqColumns<Extract<this, QueryUtil.AfterFromClause>> {
        return QueryUtil.whereEqColumns<
            Extract<this, QueryUtil.AfterFromClause>,
            TableT
        >(this, table, columns);
    }

    whereEqPk<
        TableT extends TableWithPk,
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        table : TableT & Extract<this, QueryUtil.AfterFromClause>["_joins"][number]["aliasedTable"],
        key : PrimaryKey<TableT>
    ) : QueryUtil.WhereEqPk<Extract<this, QueryUtil.AfterFromClause>> {
        return QueryUtil.whereEqPk(
            this,
            table,
            key
        );
    }

    useJoin<
        JoinDeclT extends IJoinDeclaration
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        joinDecl : QueryUtil.AssertValidJoinDeclaration<
            Extract<this, QueryUtil.AfterFromClause>,
            JoinDeclT
        >
    ) : (
        QueryUtil.UseJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            JoinDeclT
        >
    ) {
        return QueryUtil.useJoin<
            Extract<this, QueryUtil.AfterFromClause>,
            JoinDeclT
        >(this, joinDecl);
    }

    useJoins<
        ArrT extends NonEmptyTuple<IJoinDeclaration>
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        ...arr : QueryUtil.AssertValidJoinDeclarationArray<
            Extract<this, QueryUtil.AfterFromClause>,
            ArrT
        >
    ) : (
        QueryUtil.UseJoins<
            Extract<this, QueryUtil.AfterFromClause>,
            ArrT
        >
    ) {
        return QueryUtil.useJoins<
            Extract<this, QueryUtil.AfterFromClause>,
            ArrT
        >(this, arr);
    }
    //Added to speed up compile-times.
    //Some complicated queries take 700+ seconds to compile!
    useJoinsUnsafe<
        ArrT extends NonEmptyTuple<IJoinDeclaration>
    > (
        this : Extract<this, QueryUtil.AfterFromClause>,
        ...arr : ArrT
    ) : (
        QueryUtil.UseJoins<
            Extract<this, QueryUtil.AfterFromClause>,
            ArrT
        >
    ) {
        return QueryUtil.useJoins<
            Extract<this, QueryUtil.AfterFromClause>,
            ArrT
        >(this, arr as any);
    }

    assertExists (
        this : Extract<this, QueryUtil.MainQuery & (QueryUtil.AfterFromClause|QueryUtil.AfterSelectClause)>,
        connection : IConnection
    ) : Promise<void> {
        return QueryUtil.assertExists(this, connection);
    }
    count (
        this : Extract<this, QueryUtil.MainQuery>,
        connection : IConnection
    ) : Promise<bigint> {
        return QueryUtil.count(this, connection);
    }
    cursor (
        this : Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>,
        connection : IConnection
    ) : (
        QueryUtil.Cursor<
            Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>
        >
    ) {
        return QueryUtil.cursor(this, connection);
    }
    exists(
        this : Extract<this, QueryUtil.MainQuery & (QueryUtil.AfterFromClause|QueryUtil.AfterSelectClause)>,
        connection : IConnection
    ) : Promise<boolean> {
        return QueryUtil.exists(this, connection);
    }
    fetchAllUnmapped (
        this : Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>,
        connection : IConnection
    ) : (
        Promise<QueryUtil.FetchAllUnmapped<
            Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>
        >>
    ) {
        return QueryUtil.fetchAllUnmapped(this, connection);
    }
    fetchAll (
        this : Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>,
        connection : IConnection
    ) : (
        Promise<
            QueryUtil.FetchAll<
                Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>
            >
        >
    ) {
        return QueryUtil.fetchAll(this, connection);
    }
    fetchOne (
        this : Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>,
        connection : IConnection
    ) : (
        Promise<QueryUtil.FetchOne<
            Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>
        >>
    ) {
        return QueryUtil.fetchOne(this, connection);
    }
    fetchValueArray (
        this : Extract<this, QueryUtil.MainQuery & QueryUtil.OneSelectItemQuery<any>>,
        connection : IConnection
    ) : (
        Promise<QueryUtil.FetchValueArray<
            Extract<this, QueryUtil.MainQuery & QueryUtil.OneSelectItemQuery<any>>
        >>
    ) {
        return QueryUtil.fetchValueArray(this, connection);
    }
    fetchValueOrUndefined (
        this : Extract<this, QueryUtil.MainQuery & QueryUtil.OneSelectItemQuery<any>>,
        connection : IConnection
    ) : (
        Promise<QueryUtil.FetchValueOrUndefined<
            Extract<this, QueryUtil.MainQuery & QueryUtil.OneSelectItemQuery<any>>
        >>
    ) {
        return QueryUtil.fetchValueOrUndefined(this, connection);
    }
    fetchValueOrNull (
        this : Extract<this, QueryUtil.MainQuery & QueryUtil.OneSelectItemQuery<any>>,
        connection : IConnection
    ) : (
        Promise<null|QueryUtil.FetchValue<
            Extract<this, QueryUtil.MainQuery & QueryUtil.OneSelectItemQuery<any>>
        >>
    ) {
        return QueryUtil.fetchValueOrUndefined(this, connection)
            .then(r => (r == undefined) ? null : r);
    }
    fetchValue (
        this : Extract<this, QueryUtil.MainQuery & QueryUtil.OneSelectItemQuery<any>>,
        connection : IConnection
    ) : (
        Promise<QueryUtil.FetchValue<
            Extract<this, QueryUtil.MainQuery & QueryUtil.OneSelectItemQuery<any>>
        >>
    ) {
        return QueryUtil.fetchValue(this, connection);
    }
    fetchZeroOrOne (
        this : Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>,
        connection : IConnection
    ) : (
        Promise<QueryUtil.FetchZeroOrOne<
            Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>
        >>
    ) {
        return QueryUtil.fetchZeroOrOne(this, connection);
    }
    fetchOneOrNull (
        this : Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>,
        connection : IConnection
    ) : (
        Promise<null|QueryUtil.FetchOne<
            Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>
        >>
    ) {
        return QueryUtil.fetchZeroOrOne(this, connection)
            .then(r => (r == undefined) ? null : r);
    }
    paginate (
        this : Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>,
        connection : IConnection,
        rawArgs : QueryUtil.RawPaginateArgs
    ) : (
        Promise<QueryUtil.Paginate<
            Extract<this, QueryUtil.AfterSelectClause & QueryUtil.MainQuery>
        >>
    ) {
        return QueryUtil.paginate(this, connection, rawArgs);
    }
    printSql (
        this : Extract<this, QueryUtil.AfterSelectClause>
    ) : this {
        QueryUtil.printSql(this);
        return this;
    }
    printSqlPretty (
        this : Extract<this, QueryUtil.AfterSelectClause>
    ) : this {
        QueryUtil.printSqlPretty(this);
        return this;
    }
    insertIgnoreInto<
        TableT extends ITable & { insertAllowed : true }
    > (
        this : Extract<this, QueryUtil.AfterSelectClause>,
        table : TableT,
        delegate : InsertSelectRowDelegate<
            Extract<this, QueryUtil.AfterSelectClause>,
            TableT
        >
    ) : (
        QueryUtil.InsertIgnoreInto<
            Extract<this, QueryUtil.AfterSelectClause>,
            TableT
        >
    ) {
        return QueryUtil.insertIgnoreInto(
            this,
            table,
            delegate
        );
    }
    insertInto<
        TableT extends ITable & { insertAllowed : true }
    > (
        this : Extract<this, QueryUtil.AfterSelectClause>,
        table : TableT,
        delegate : InsertSelectRowDelegate<
            Extract<this, QueryUtil.AfterSelectClause>,
            TableT
        >
    ) : (
        QueryUtil.InsertInto<
            Extract<this, QueryUtil.AfterSelectClause>,
            TableT
        >
    ) {
        return QueryUtil.insertInto(
            this,
            table,
            delegate
        );
    }
    replaceInto<
        TableT extends ITable & { insertAllowed : true }
    > (
        this : Extract<this, QueryUtil.AfterSelectClause>,
        table : TableT,
        delegate : InsertSelectRowDelegate<
            Extract<this, QueryUtil.AfterSelectClause>,
            TableT
        >
    ) : (
        QueryUtil.ReplaceInto<
            Extract<this, QueryUtil.AfterSelectClause>,
            TableT
        >
    ) {
        return QueryUtil.replaceInto(
            this,
            table,
            delegate
        );
    }
    set<
        DelegateT extends UpdateUtil.SingleTableSetDelegate<
            Extract<this, UpdatableQuery>
        >
    > (
        this : (
            Extract<this, UpdatableQuery> &
            UpdateUtil.AssertValidSingleTableSetDelegate_Hack<
                Extract<this, UpdatableQuery>,
                DelegateT
            > &
            UpdateUtil.AssertValidSingleTableUpdatableQuery<
                Extract<this, UpdatableQuery>
            >
        ),
        delegate : DelegateT
    ) : (
        QueryUtil.Set<Extract<this, UpdatableQuery>>
    );
    set<
        DelegateT extends UpdateUtil.SetDelegate<
            Extract<this, UpdatableQuery>
        >
    > (
        this : (
            Extract<this, UpdatableQuery> &
            UpdateUtil.AssertValidSetDelegate_Hack<
                Extract<this, UpdatableQuery>,
                DelegateT
            >
        ),
        delegate : DelegateT
    ) : (
        QueryUtil.Set<Extract<this, UpdatableQuery>>
    );
    set (delegate : () => any) : (
        QueryUtil.Set<Extract<this, UpdatableQuery>>
    ) {
        return QueryUtil.set(this as any, delegate);
    }
    delete (
        this : Extract<this, DeletableQuery>,
        delegate : DeleteUtil.DeleteDelegate<Extract<this, DeletableQuery>>
    ) : (
        Delete<{
            _query : DeletableQuery,
            _tables : (ITable & { deleteAllowed : true })[],
            _modifier : undefined,
        }>
    ) {
        return QueryUtil.delete(this, delegate);
    }
    deleteIgnore (
        this : Extract<this, DeletableQuery>,
        delegate : DeleteUtil.DeleteDelegate<Extract<this, DeletableQuery>>
    ) : (
        Delete<{
            _query : DeletableQuery,
            _tables : (ITable & { deleteAllowed : true })[],
            _modifier : DeleteModifier.IGNORE,
        }>
    ) {
        return QueryUtil.deleteIgnore(this, delegate);
    }
    subQuery () : QueryUtil.SubQueryResult<this> {
        return QueryUtil.subQuery(this);
    }
}
