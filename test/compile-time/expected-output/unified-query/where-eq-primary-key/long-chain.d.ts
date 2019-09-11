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
            };
            primaryKey: readonly ("myTableIdA" | "myTableIdB")[];
            candidateKeys: readonly (readonly ("myTableIdA" | "myTableIdB")[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>[];
    }>;
    selectClause: undefined;
    limitClause: undefined;
    unionClause: undefined;
    unionLimitClause: undefined;
}>;
