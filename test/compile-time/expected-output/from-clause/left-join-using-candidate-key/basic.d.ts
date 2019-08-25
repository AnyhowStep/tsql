import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const eqCandidateKeyOfTable: tsql.EqCandidateKeyOfTable;
export declare const fromClause: tsql.IFromClause<{
    outerQueryJoins: undefined;
    currentJoins: readonly (tsql.Join<{
        tableAlias: "myTable";
        nullable: false;
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "createdAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
            readonly otherTableId: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "otherTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        originalColumns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "createdAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
            readonly otherTableId: tsql.Column<{
                tableAlias: "myTable";
                columnAlias: "otherTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        primaryKey: undefined;
        candidateKeys: readonly [];
        deleteEnabled: true;
        mutableColumns: readonly [];
    }> | tsql.Join<{
        tableAlias: "otherTable";
        nullable: true;
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "otherTable";
                columnAlias: "createdAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
            readonly otherTableId: tsql.Column<{
                tableAlias: "otherTable";
                columnAlias: "otherTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        originalColumns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "otherTable";
                columnAlias: "createdAt";
                mapper: tm.Mapper<unknown, Date>;
            }>;
            readonly otherTableId: tsql.Column<{
                tableAlias: "otherTable";
                columnAlias: "otherTableId";
                mapper: tm.Mapper<unknown, bigint>;
            }>;
        };
        primaryKey: undefined;
        candidateKeys: readonly (readonly "otherTableId"[])[];
        deleteEnabled: true;
        mutableColumns: readonly [];
    }>)[];
}>;
