import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
export declare const result: {
    fromClause: tsql.IFromClause<{
        outerQueryJoins: readonly (tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly userId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            originalColumns: {
                readonly userId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "computerId")[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myTable2";
            nullable: false;
            columns: {
                readonly userId: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            originalColumns: {
                readonly userId: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "createdAt")[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>)[];
        currentJoins: readonly tsql.Join<{
            tableAlias: "childTable";
            nullable: false;
            columns: {
                readonly userId: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
                readonly accessedAt: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "accessedAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            originalColumns: {
                readonly userId: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
                readonly accessedAt: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "accessedAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>[];
    }>;
    whereClause: tsql.IExpr<{
        mapper: tm.Mapper<unknown, boolean>;
        usedRef: tsql.IUsedRef<never>;
        isAggregate: false;
    }>;
};
export declare const result2: {
    fromClause: tsql.IFromClause<{
        outerQueryJoins: readonly (tsql.Join<{
            tableAlias: "myTable";
            nullable: false;
            columns: {
                readonly userId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            originalColumns: {
                readonly userId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "computerId")[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }> | tsql.Join<{
            tableAlias: "myTable2";
            nullable: false;
            columns: {
                readonly userId: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            originalColumns: {
                readonly userId: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "createdAt")[])[];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>)[];
        currentJoins: readonly tsql.Join<{
            tableAlias: "childTable";
            nullable: false;
            columns: {
                readonly userId: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
                readonly accessedAt: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "accessedAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            originalColumns: {
                readonly userId: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "userId";
                    mapper: tm.Mapper<unknown, bigint>;
                }>;
                readonly computerId: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "computerId";
                    mapper: tm.Mapper<unknown, string>;
                }>;
                readonly createdAt: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "createdAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
                readonly accessedAt: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "accessedAt";
                    mapper: tm.Mapper<unknown, Date>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly [];
            deleteEnabled: true;
            mutableColumns: readonly [];
        }>[];
    }>;
    whereClause: tsql.IExpr<{
        mapper: tm.Mapper<unknown, boolean>;
        usedRef: tsql.IUsedRef<never>;
        isAggregate: false;
    }>;
};
