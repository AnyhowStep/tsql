import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const myQuery: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly myColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myColumn2: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn2";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly stringColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "stringColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            originalColumns: {
                readonly myColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myColumn2: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn2";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly stringColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "stringColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>[];
    }>;
    selectClause: [tsql.Column<{
        tableAlias: "myTable";
        columnAlias: "myColumn";
        mapper: tm.Mapper<unknown, bigint>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, bigint>;
        tableAlias: "myTable";
        alias: "aliasedColumnExpression";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, "I am an aliased expression">;
        tableAlias: "__aliased";
        alias: "aliasedLiteralValueExpression";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, string>;
        tableAlias: "__aliased";
        alias: "aliasedExpression";
        usedRef: tsql.IUsedRef<never>;
    }>, tsql.IExprSelectItem<{
        mapper: tm.Mapper<unknown, bigint | null>;
        tableAlias: "__aliased";
        alias: "aliasedSubqueryExpression";
        usedRef: tsql.IUsedRef<never>;
    }>];
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: undefined;
}>;
export declare const fetchedRow: Promise<{
    readonly myColumn: bigint;
    readonly aliasedColumnExpression: bigint;
    readonly aliasedLiteralValueExpression: "I am an aliased expression";
    readonly aliasedExpression: string;
    readonly aliasedSubqueryExpression: bigint | null;
}>;
