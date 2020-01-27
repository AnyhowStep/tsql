import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myTableId2: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId2";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            originalColumns: {
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myTableId2: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId2";
                    mapper: tm.Mapper<unknown, bigint>;
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
        columnAlias: "myTableId";
        mapper: tm.Mapper<unknown, bigint>;
    }>, tsql.Column<{
        tableAlias: "myTable";
        columnAlias: "myTableId2";
        mapper: tm.Mapper<unknown, bigint>;
    }>];
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: tsql.MapDelegate<never, never, Promise<{
        y: bigint;
        x: bigint;
        myTable: {
            readonly myTableId: bigint;
        };
    }>>;
    groupByClause: undefined;
}>;
