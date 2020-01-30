import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly myColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            originalColumns: {
                readonly myColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>[];
    }>;
    selectClause: [tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "x";
        usedRef: tsql.IUsedRef<never>;
        isAggregate: false;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, boolean>;
        tableAlias: "$aliased";
        alias: "y";
        usedRef: tsql.IUsedRef<never>;
        isAggregate: false;
    }>];
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: undefined;
    groupByClause: undefined;
}>;
