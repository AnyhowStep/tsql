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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "computerId")[] | readonly ("userId" | "myTableColumn")[])[];
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
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "createdAt")[] | readonly ("userId" | "myTable2Column")[])[];
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "computerId")[] | readonly ("userId" | "myTableColumn")[])[];
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
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "createdAt")[] | readonly ("userId" | "myTable2Column")[])[];
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
export declare const result3: {
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "computerId")[] | readonly ("userId" | "myTableColumn")[])[];
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
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "createdAt")[] | readonly ("userId" | "myTable2Column")[])[];
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
export declare const result4: {
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "myTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "computerId")[] | readonly ("userId" | "myTableColumn")[])[];
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
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "myTable2";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
                }>;
            };
            primaryKey: undefined;
            candidateKeys: readonly (readonly ("userId" | "createdAt")[] | readonly ("userId" | "myTable2Column")[])[];
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
                readonly myTableColumn: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTableColumn";
                    mapper: tm.Mapper<unknown, number>;
                }>;
                readonly myTable2Column: tsql.Column<{
                    tableAlias: "childTable";
                    columnAlias: "myTable2Column";
                    mapper: tm.Mapper<unknown, boolean>;
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
