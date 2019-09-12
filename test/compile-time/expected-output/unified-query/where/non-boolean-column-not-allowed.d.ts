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
                    mapper: tm.Mapper<unknown, number>;
                }>;
            };
            originalColumns: {
                readonly myColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myColumn";
                    mapper: tm.Mapper<unknown, number>;
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
