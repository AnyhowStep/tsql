import * as tsql from "../../../../../dist";
export declare const browser: {
    readonly key: tsql.CustomExpr_NonCorrelated<string>;
    readonly appId: tsql.CustomExpr_NonCorrelated<bigint>;
} & {
    readonly disabledAt?: tsql.CustomExpr_NonCorrelatedOrUndefined<Date | null>;
    readonly createdAt?: tsql.CustomExpr_NonCorrelatedOrUndefined<Date>;
    readonly referer?: tsql.CustomExpr_NonCorrelatedOrUndefined<string | null>;
} & {};
export declare const server: {
    readonly key: tsql.CustomExpr_NonCorrelated<string>;
    readonly appId: tsql.CustomExpr_NonCorrelated<bigint>;
} & {
    readonly disabledAt?: tsql.CustomExpr_NonCorrelatedOrUndefined<Date | null>;
    readonly createdAt?: tsql.CustomExpr_NonCorrelatedOrUndefined<Date>;
    readonly ipAddress?: tsql.CustomExpr_NonCorrelatedOrUndefined<string | null>;
    readonly trustProxy?: boolean | tsql.IExpr<{
        mapper: import("type-mapping").Mapper<unknown, boolean>;
        usedRef: tsql.IUsedRef<{}>;
    }> | tsql.IExprSelectItem<{
        mapper: import("type-mapping").Mapper<unknown, boolean>;
        tableAlias: string;
        alias: string;
        usedRef: tsql.IUsedRef<{}>;
    }> | (tsql.IQueryBase<{
        fromClause: tsql.IFromClause<tsql.FromClauseData>;
        selectClause: [tsql.IColumn<{
            tableAlias: string;
            columnAlias: string;
            mapper: import("type-mapping").Mapper<unknown, boolean>;
        }> | tsql.IExprSelectItem<{
            mapper: import("type-mapping").Mapper<unknown, boolean>;
            tableAlias: string;
            alias: string;
            usedRef: tsql.IUsedRef<never>;
        }>];
        limitClause: tsql.LimitClause | undefined;
        compoundQueryClause: readonly tsql.CompoundQuery[] | undefined;
        compoundQueryLimitClause: tsql.LimitClause | undefined;
        mapDelegate: tsql.MapDelegate<never, never, unknown> | undefined;
    }> & tsql.IQueryBase<{
        fromClause: tsql.IFromClause<{
            outerQueryJoins: readonly tsql.IJoin<tsql.JoinData>[] | undefined;
            currentJoins: undefined;
        }>;
        selectClause: readonly (tsql.ColumnMap | tsql.IColumn<tsql.ColumnData> | tsql.ColumnRef | tsql.IExprSelectItem<tsql.ExprSelectItemData>)[] | undefined;
        limitClause: tsql.LimitClause | undefined;
        compoundQueryClause: undefined;
        compoundQueryLimitClause: tsql.LimitClause | undefined;
        mapDelegate: tsql.MapDelegate<never, never, unknown> | undefined;
    }> & tsql.IQueryBase<{
        fromClause: tsql.IFromClause<{
            outerQueryJoins: undefined;
            currentJoins: readonly tsql.IJoin<tsql.JoinData>[] | undefined;
        }>;
        selectClause: readonly (tsql.ColumnMap | tsql.IColumn<tsql.ColumnData> | tsql.ColumnRef | tsql.IExprSelectItem<tsql.ExprSelectItemData>)[] | undefined;
        limitClause: tsql.LimitClause | undefined;
        compoundQueryClause: readonly tsql.CompoundQuery[] | undefined;
        compoundQueryLimitClause: tsql.LimitClause | undefined;
        mapDelegate: tsql.MapDelegate<never, never, unknown> | undefined;
    }>) | undefined;
} & {};
