import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const query: tsql.Query<{
    fromClause: tsql.IFromClause<{
        outerQueryJoins: readonly tsql.Join<{
            tableAlias: "outerTable";
            nullable: false;
            columns: {
                readonly outerTableIdA: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTableIdB: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly outerColumn: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            originalColumns: {
                readonly outerTableIdA: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTableIdB: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly outerColumn: tsql.Column<{
                    tableAlias: "outerTable";
                    columnAlias: "outerColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            primaryKey: readonly ("outerTableIdA" | "outerTableIdB")[];
            candidateKeys: readonly (readonly ("outerTableIdA" | "outerTableIdB")[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>[];
        currentJoins: readonly tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly outerTableIdA: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "outerTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTableIdB: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "outerTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly otherColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "otherColumn";
                    mapper: tm.Mapper<unknown, string>;
                }>;
            };
            originalColumns: {
                readonly outerTableIdA: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "outerTableIdA";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly outerTableIdB: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "outerTableIdB";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
                readonly otherColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "otherColumn";
                    mapper: tm.Mapper<unknown, string>;
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
}>;
