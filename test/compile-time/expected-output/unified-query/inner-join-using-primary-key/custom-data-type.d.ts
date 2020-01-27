import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly (tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myOtherTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myOtherTableId";
                    mapper: tm.Mapper<unknown, {
                        x: number;
                        y: number;
                    }>;
                }>;
            };
            originalColumns: {
                readonly myTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myOtherTableId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myOtherTableId";
                    mapper: tm.Mapper<unknown, {
                        x: number;
                        y: number;
                    }>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable";
            nullable: false;
            columns: {
                readonly myOtherTableId: tsql.Column<{
                    tableAlias: "myOtherTable";
                    columnAlias: "myOtherTableId";
                    mapper: tm.Mapper<unknown, {
                        x: number;
                        y: number;
                    }>;
                }>;
            };
            originalColumns: {
                readonly myOtherTableId: tsql.Column<{
                    tableAlias: "myOtherTable";
                    columnAlias: "myOtherTableId";
                    mapper: tm.Mapper<unknown, {
                        x: number;
                        y: number;
                    }>;
                }>;
            };
            primaryKey: readonly "myOtherTableId"[];
            candidateKeys: readonly (readonly "myOtherTableId"[])[];
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
