import {ExtraQueryData, QueryData, IQuery} from "./query";
import {WhereClause} from "../where-clause";
import {GroupByClause} from "../group-by-clause";
import {HavingClause} from "../having-clause";
import {OrderByClause} from "../order-by-clause";
import {IAliasedTable} from "../aliased-table";
import {FromClauseUtil} from "../from-clause";
/**
 * @todo Rename to `UnifiedQueryUtil` or something
 */
import * as QueryUtil from "./util";

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
}
