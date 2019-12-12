import * as tsql from "../../../../dist";
export declare const a1: tsql.Table<{
    isLateral: false;
    alias: "a1";
    columns: {
        readonly createdAt: tsql.Column<{
            tableAlias: "a1";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly a1Id: tsql.Column<{
            tableAlias: "a1";
            columnAlias: "a1Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly a1Name: tsql.Column<{
            tableAlias: "a1";
            columnAlias: "a1Name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "a1Id";
    id: "a1Id";
    primaryKey: readonly "a1Id"[];
    candidateKeys: readonly (readonly "a1Id"[] | readonly "a1Name"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly never[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly "a1Name"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const a2: tsql.Table<{
    isLateral: false;
    alias: "a2";
    columns: {
        readonly createdAt: tsql.Column<{
            tableAlias: "a2";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly a2Id: tsql.Column<{
            tableAlias: "a2";
            columnAlias: "a2Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly a2Name: tsql.Column<{
            tableAlias: "a2";
            columnAlias: "a2Name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "a2Id";
    id: "a2Id";
    primaryKey: readonly "a2Id"[];
    candidateKeys: readonly (readonly "a2Id"[] | readonly "a2Name"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly never[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly "a2Name"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const a3: tsql.Table<{
    isLateral: false;
    alias: "a3";
    columns: {
        readonly createdAt: tsql.Column<{
            tableAlias: "a3";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly a3Id: tsql.Column<{
            tableAlias: "a3";
            columnAlias: "a3Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly a3Name: tsql.Column<{
            tableAlias: "a3";
            columnAlias: "a3Name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "a3Id";
    id: "a3Id";
    primaryKey: readonly "a3Id"[];
    candidateKeys: readonly (readonly "a3Id"[] | readonly "a3Name"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly never[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly "a3Name"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const a4: tsql.Table<{
    isLateral: false;
    alias: "a4";
    columns: {
        readonly createdAt: tsql.Column<{
            tableAlias: "a4";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly a4Id: tsql.Column<{
            tableAlias: "a4";
            columnAlias: "a4Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly a4Name: tsql.Column<{
            tableAlias: "a4";
            columnAlias: "a4Name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "a4Id";
    id: "a4Id";
    primaryKey: readonly "a4Id"[];
    candidateKeys: readonly (readonly "a4Id"[] | readonly "a4Name"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly never[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly "a4Name"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const b1: tsql.Table<{
    isLateral: false;
    alias: "b1";
    columns: {
        readonly createdAt: tsql.Column<{
            tableAlias: "b1";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly a1Id: tsql.Column<{
            tableAlias: "b1";
            columnAlias: "a1Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly a1Name: tsql.Column<{
            tableAlias: "b1";
            columnAlias: "a1Name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly a2Id: tsql.Column<{
            tableAlias: "b1";
            columnAlias: "a2Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly b1Id: tsql.Column<{
            tableAlias: "b1";
            columnAlias: "b1Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly b1Name: tsql.Column<{
            tableAlias: "b1";
            columnAlias: "b1Name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "b1Id";
    id: "b1Id";
    primaryKey: readonly "b1Id"[];
    candidateKeys: readonly (readonly "b1Id"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly never[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly "a1Name"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const b2: tsql.Table<{
    isLateral: false;
    alias: "b2";
    columns: {
        readonly createdAt: tsql.Column<{
            tableAlias: "b2";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly a3Id: tsql.Column<{
            tableAlias: "b2";
            columnAlias: "a3Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly a4Id: tsql.Column<{
            tableAlias: "b2";
            columnAlias: "a4Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly b2Name: tsql.Column<{
            tableAlias: "b2";
            columnAlias: "b2Name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: undefined;
    primaryKey: readonly "a3Id"[];
    candidateKeys: readonly (readonly "a3Id"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly "b2Name"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const c: tsql.Table<{
    isLateral: false;
    alias: "c";
    columns: {
        readonly createdAt: tsql.Column<{
            tableAlias: "c";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly a3Id: tsql.Column<{
            tableAlias: "c";
            columnAlias: "a3Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly b1Id: tsql.Column<{
            tableAlias: "c";
            columnAlias: "b1Id";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly b2Name: tsql.Column<{
            tableAlias: "c";
            columnAlias: "b2Name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: undefined;
    primaryKey: readonly ("a3Id" | "b1Id")[];
    candidateKeys: readonly (readonly ("a3Id" | "b1Id")[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly "b2Name"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const b1Tpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "b1";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a1Id: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "a1Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a1Name: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "a1Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly a2Id: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "a2Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly b1Id: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "b1Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly b1Name: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "b1Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "b1Id";
        id: "b1Id";
        primaryKey: readonly "b1Id"[];
        candidateKeys: readonly (readonly "b1Id"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "a1Name"[];
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly (tsql.Table<{
        isLateral: false;
        alias: "a1";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "a1";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a1Id: tsql.Column<{
                tableAlias: "a1";
                columnAlias: "a1Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a1Name: tsql.Column<{
                tableAlias: "a1";
                columnAlias: "a1Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "a1Id";
        id: "a1Id";
        primaryKey: readonly "a1Id"[];
        candidateKeys: readonly (readonly "a1Id"[] | readonly "a1Name"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "a1Name"[];
        explicitAutoIncrementValueEnabled: false;
    }> | tsql.Table<{
        isLateral: false;
        alias: "a2";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "a2";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a2Id: tsql.Column<{
                tableAlias: "a2";
                columnAlias: "a2Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a2Name: tsql.Column<{
                tableAlias: "a2";
                columnAlias: "a2Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "a2Id";
        id: "a2Id";
        primaryKey: readonly "a2Id"[];
        candidateKeys: readonly (readonly "a2Id"[] | readonly "a2Name"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "a2Name"[];
        explicitAutoIncrementValueEnabled: false;
    }>)[];
    autoIncrement: readonly ("a1Id" | "a2Id" | "b1Id")[];
    explicitAutoIncrementValueEnabled: readonly never[];
    insertAndFetchPrimaryKey: readonly never[];
}>;
export declare const b2Tpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "b2";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "b2";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a3Id: tsql.Column<{
                tableAlias: "b2";
                columnAlias: "a3Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a4Id: tsql.Column<{
                tableAlias: "b2";
                columnAlias: "a4Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly b2Name: tsql.Column<{
                tableAlias: "b2";
                columnAlias: "b2Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: undefined;
        primaryKey: readonly "a3Id"[];
        candidateKeys: readonly (readonly "a3Id"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "b2Name"[];
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly (tsql.Table<{
        isLateral: false;
        alias: "a3";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "a3";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a3Id: tsql.Column<{
                tableAlias: "a3";
                columnAlias: "a3Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a3Name: tsql.Column<{
                tableAlias: "a3";
                columnAlias: "a3Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "a3Id";
        id: "a3Id";
        primaryKey: readonly "a3Id"[];
        candidateKeys: readonly (readonly "a3Id"[] | readonly "a3Name"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "a3Name"[];
        explicitAutoIncrementValueEnabled: false;
    }> | tsql.Table<{
        isLateral: false;
        alias: "a4";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "a4";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a4Id: tsql.Column<{
                tableAlias: "a4";
                columnAlias: "a4Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a4Name: tsql.Column<{
                tableAlias: "a4";
                columnAlias: "a4Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "a4Id";
        id: "a4Id";
        primaryKey: readonly "a4Id"[];
        candidateKeys: readonly (readonly "a4Id"[] | readonly "a4Name"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "a4Name"[];
        explicitAutoIncrementValueEnabled: false;
    }>)[];
    autoIncrement: readonly ("a3Id" | "a4Id")[];
    explicitAutoIncrementValueEnabled: readonly never[];
    insertAndFetchPrimaryKey: readonly never[];
}>;
export declare const cTpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "c";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "c";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a3Id: tsql.Column<{
                tableAlias: "c";
                columnAlias: "a3Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly b1Id: tsql.Column<{
                tableAlias: "c";
                columnAlias: "b1Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly b2Name: tsql.Column<{
                tableAlias: "c";
                columnAlias: "b2Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: undefined;
        primaryKey: readonly ("a3Id" | "b1Id")[];
        candidateKeys: readonly (readonly ("a3Id" | "b1Id")[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "b2Name"[];
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly (tsql.Table<{
        isLateral: false;
        alias: "a1";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "a1";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a1Id: tsql.Column<{
                tableAlias: "a1";
                columnAlias: "a1Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a1Name: tsql.Column<{
                tableAlias: "a1";
                columnAlias: "a1Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "a1Id";
        id: "a1Id";
        primaryKey: readonly "a1Id"[];
        candidateKeys: readonly (readonly "a1Id"[] | readonly "a1Name"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "a1Name"[];
        explicitAutoIncrementValueEnabled: false;
    }> | tsql.Table<{
        isLateral: false;
        alias: "a2";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "a2";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a2Id: tsql.Column<{
                tableAlias: "a2";
                columnAlias: "a2Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a2Name: tsql.Column<{
                tableAlias: "a2";
                columnAlias: "a2Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "a2Id";
        id: "a2Id";
        primaryKey: readonly "a2Id"[];
        candidateKeys: readonly (readonly "a2Id"[] | readonly "a2Name"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "a2Name"[];
        explicitAutoIncrementValueEnabled: false;
    }> | tsql.Table<{
        isLateral: false;
        alias: "a3";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "a3";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a3Id: tsql.Column<{
                tableAlias: "a3";
                columnAlias: "a3Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a3Name: tsql.Column<{
                tableAlias: "a3";
                columnAlias: "a3Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "a3Id";
        id: "a3Id";
        primaryKey: readonly "a3Id"[];
        candidateKeys: readonly (readonly "a3Id"[] | readonly "a3Name"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "a3Name"[];
        explicitAutoIncrementValueEnabled: false;
    }> | tsql.Table<{
        isLateral: false;
        alias: "a4";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "a4";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a4Id: tsql.Column<{
                tableAlias: "a4";
                columnAlias: "a4Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a4Name: tsql.Column<{
                tableAlias: "a4";
                columnAlias: "a4Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "a4Id";
        id: "a4Id";
        primaryKey: readonly "a4Id"[];
        candidateKeys: readonly (readonly "a4Id"[] | readonly "a4Name"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "a4Name"[];
        explicitAutoIncrementValueEnabled: false;
    }> | tsql.Table<{
        isLateral: false;
        alias: "b1";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a1Id: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "a1Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a1Name: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "a1Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly a2Id: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "a2Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly b1Id: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "b1Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly b1Name: tsql.Column<{
                tableAlias: "b1";
                columnAlias: "b1Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "b1Id";
        id: "b1Id";
        primaryKey: readonly "b1Id"[];
        candidateKeys: readonly (readonly "b1Id"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "a1Name"[];
        explicitAutoIncrementValueEnabled: false;
    }> | tsql.Table<{
        isLateral: false;
        alias: "b2";
        columns: {
            readonly createdAt: tsql.Column<{
                tableAlias: "b2";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly a3Id: tsql.Column<{
                tableAlias: "b2";
                columnAlias: "a3Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly a4Id: tsql.Column<{
                tableAlias: "b2";
                columnAlias: "a4Id";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly b2Name: tsql.Column<{
                tableAlias: "b2";
                columnAlias: "b2Name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: undefined;
        primaryKey: readonly "a3Id"[];
        candidateKeys: readonly (readonly "a3Id"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: never[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly "b2Name"[];
        explicitAutoIncrementValueEnabled: false;
    }>)[];
    autoIncrement: readonly ("a1Id" | "a2Id" | "a3Id" | "a4Id" | "b1Id")[];
    explicitAutoIncrementValueEnabled: readonly never[];
    insertAndFetchPrimaryKey: readonly never[];
}>;
