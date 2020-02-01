import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly tsql.Join<{
            tableAlias: "t";
            nullable: false;
            columns: {
                readonly x: tsql.Column<{
                    tableAlias: "t";
                    columnAlias: "x";
                    mapper: import("type-mapping").Mapper<unknown, bigint>;
                }>;
            };
            originalColumns: {
                readonly x: tsql.Column<{
                    tableAlias: "t";
                    columnAlias: "x";
                    mapper: import("type-mapping").Mapper<unknown, bigint>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>[];
    }>;
    selectClause: undefined;
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: undefined;
    groupByClause: readonly {
        readonly tableAlias: "t";
        readonly columnAlias: "x";
    }[];
}>;
