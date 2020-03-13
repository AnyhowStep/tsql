import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly (tsql.Join<{
            tableAlias: "table0";
            nullable: false;
            columns: {
                readonly table1Id: tsql.Column<{
                    tableAlias: "table0";
                    columnAlias: "table1Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly table0Id: tsql.Column<{
                    tableAlias: "table0";
                    columnAlias: "table0Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            originalColumns: {
                readonly table1Id: tsql.Column<{
                    tableAlias: "table0";
                    columnAlias: "table1Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly table0Id: tsql.Column<{
                    tableAlias: "table0";
                    columnAlias: "table0Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "table1";
            nullable: true;
            columns: {
                readonly table1Id: tsql.Column<{
                    tableAlias: "table1";
                    columnAlias: "table1Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly table2Id: tsql.Column<{
                    tableAlias: "table1";
                    columnAlias: "table2Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            originalColumns: {
                readonly table1Id: tsql.Column<{
                    tableAlias: "table1";
                    columnAlias: "table1Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly table2Id: tsql.Column<{
                    tableAlias: "table1";
                    columnAlias: "table2Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            primaryKey: readonly "table1Id"[];
            candidateKeys: readonly (readonly "table1Id"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "table2";
            nullable: true;
            columns: {
                readonly table2Id: tsql.Column<{
                    tableAlias: "table2";
                    columnAlias: "table2Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly table3Id: tsql.Column<{
                    tableAlias: "table2";
                    columnAlias: "table3Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            originalColumns: {
                readonly table2Id: tsql.Column<{
                    tableAlias: "table2";
                    columnAlias: "table2Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly table3Id: tsql.Column<{
                    tableAlias: "table2";
                    columnAlias: "table3Id";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            primaryKey: readonly "table2Id"[];
            candidateKeys: readonly (readonly "table2Id"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>)[];
    }>;
    selectClause: undefined;
    limitClause: undefined;
    compoundQueryClause: undefined;
    compoundQueryLimitClause: undefined;
    mapDelegate: undefined;
    groupByClause: undefined;
}>;
