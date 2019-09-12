import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: undefined;
        currentJoins: readonly tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly otherColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "otherColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly myTableIdA: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myTableIdB: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly nullableColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "nullableColumn";
                    mapper: tm.Mapper<unknown, number | null>;
                }>;
            };
            originalColumns: {
                readonly otherColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "otherColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly myTableIdA: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly myTableIdB: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly nullableColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "nullableColumn";
                    mapper: tm.Mapper<unknown, number | null>;
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
}>;
