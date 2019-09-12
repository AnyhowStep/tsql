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
                    mapper: tm.Mapper<unknown, bigint>;
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
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myOtherTable";
            nullable: true;
            columns: {
                readonly myTableId: tsql.Column<{
                    tableAlias: "myOtherTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myOtherTableId: tsql.Column<{
                    tableAlias: "myOtherTable";
                    columnAlias: "myOtherTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            originalColumns: {
                readonly myTableId: tsql.Column<{
                    tableAlias: "myOtherTable";
                    columnAlias: "myTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myOtherTableId: tsql.Column<{
                    tableAlias: "myOtherTable";
                    columnAlias: "myOtherTableId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly "myOtherTableId"[] | readonly "myTableId"[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>)[];
    }>;
    selectClause: undefined;
    limitClause: undefined;
    compoundQueryClause: undefined;
    unionLimitClause: undefined;
}>;
