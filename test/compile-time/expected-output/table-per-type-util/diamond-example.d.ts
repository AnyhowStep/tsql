import * as tsql from "../../../../dist";
export declare const animal: tsql.Table<{
    isLateral: false;
    alias: "animal";
    columns: {
        readonly appId: tsql.Column<{
            tableAlias: "animal";
            columnAlias: "appId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly name: tsql.Column<{
            tableAlias: "animal";
            columnAlias: "name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly createdAt: tsql.Column<{
            tableAlias: "animal";
            columnAlias: "createdAt";
            mapper: import("type-mapping").Mapper<unknown, Date>;
        }>;
        readonly animalId: tsql.Column<{
            tableAlias: "animal";
            columnAlias: "animalId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly extinctAt: tsql.Column<{
            tableAlias: "animal";
            columnAlias: "extinctAt";
            mapper: import("type-mapping").Mapper<unknown, Date | null>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: "animalId";
    id: "animalId";
    primaryKey: readonly "animalId"[];
    candidateKeys: readonly (readonly "name"[] | readonly "animalId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly never[];
    nullableColumns: "extinctAt"[];
    explicitDefaultValueColumns: readonly "createdAt"[];
    mutableColumns: readonly ("name" | "extinctAt")[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const cat: tsql.Table<{
    isLateral: false;
    alias: "cat";
    columns: {
        readonly name: tsql.Column<{
            tableAlias: "cat";
            columnAlias: "name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly animalId: tsql.Column<{
            tableAlias: "cat";
            columnAlias: "animalId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly purrFrequency: tsql.Column<{
            tableAlias: "cat";
            columnAlias: "purrFrequency";
            mapper: import("type-mapping").Mapper<unknown, number | null>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: "animalId";
    primaryKey: readonly "animalId"[];
    candidateKeys: readonly (readonly "animalId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: "purrFrequency"[];
    explicitDefaultValueColumns: readonly "purrFrequency"[];
    mutableColumns: readonly "purrFrequency"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const dog: tsql.Table<{
    isLateral: false;
    alias: "dog";
    columns: {
        readonly name: tsql.Column<{
            tableAlias: "dog";
            columnAlias: "name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly animalId: tsql.Column<{
            tableAlias: "dog";
            columnAlias: "animalId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly barksPerMinute: tsql.Column<{
            tableAlias: "dog";
            columnAlias: "barksPerMinute";
            mapper: import("type-mapping").Mapper<unknown, bigint | null>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: "animalId";
    primaryKey: readonly "animalId"[];
    candidateKeys: readonly (readonly "animalId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: "barksPerMinute"[];
    explicitDefaultValueColumns: readonly [];
    mutableColumns: readonly "barksPerMinute"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const catDog: tsql.Table<{
    isLateral: false;
    alias: "catDog";
    columns: {
        readonly name: tsql.Column<{
            tableAlias: "catDog";
            columnAlias: "name";
            mapper: import("type-mapping").Mapper<unknown, string>;
        }>;
        readonly animalId: tsql.Column<{
            tableAlias: "catDog";
            columnAlias: "animalId";
            mapper: import("type-mapping").Mapper<unknown, bigint>;
        }>;
        readonly barksPerMinute: tsql.Column<{
            tableAlias: "catDog";
            columnAlias: "barksPerMinute";
            mapper: import("type-mapping").Mapper<unknown, bigint | null>;
        }>;
        readonly headsOnSameEndOfBody: tsql.Column<{
            tableAlias: "catDog";
            columnAlias: "headsOnSameEndOfBody";
            mapper: import("type-mapping").Mapper<unknown, boolean>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: "animalId";
    primaryKey: readonly "animalId"[];
    candidateKeys: readonly (readonly "animalId"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: "barksPerMinute"[];
    explicitDefaultValueColumns: readonly [];
    mutableColumns: readonly "headsOnSameEndOfBody"[];
    explicitAutoIncrementValueEnabled: false;
}>;
export declare const catTpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "cat";
        columns: {
            readonly name: tsql.Column<{
                tableAlias: "cat";
                columnAlias: "name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly animalId: tsql.Column<{
                tableAlias: "cat";
                columnAlias: "animalId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly purrFrequency: tsql.Column<{
                tableAlias: "cat";
                columnAlias: "purrFrequency";
                mapper: import("type-mapping").Mapper<unknown, number | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: "animalId";
        primaryKey: readonly "animalId"[];
        candidateKeys: readonly (readonly "animalId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: "purrFrequency"[];
        explicitDefaultValueColumns: readonly "purrFrequency"[];
        mutableColumns: readonly "purrFrequency"[];
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly tsql.Table<{
        isLateral: false;
        alias: "animal";
        columns: {
            readonly appId: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "appId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly name: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly createdAt: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly animalId: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "animalId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly extinctAt: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "extinctAt";
                mapper: import("type-mapping").Mapper<unknown, Date | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "animalId";
        id: "animalId";
        primaryKey: readonly "animalId"[];
        candidateKeys: readonly (readonly "name"[] | readonly "animalId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: "extinctAt"[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly ("name" | "extinctAt")[];
        explicitAutoIncrementValueEnabled: false;
    }>[];
    autoIncrement: readonly "animalId"[];
    explicitAutoIncrementValueEnabled: readonly never[];
    insertAndFetchPrimaryKey: readonly never[];
}>;
export declare const dogTpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "dog";
        columns: {
            readonly name: tsql.Column<{
                tableAlias: "dog";
                columnAlias: "name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly animalId: tsql.Column<{
                tableAlias: "dog";
                columnAlias: "animalId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly barksPerMinute: tsql.Column<{
                tableAlias: "dog";
                columnAlias: "barksPerMinute";
                mapper: import("type-mapping").Mapper<unknown, bigint | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: "animalId";
        primaryKey: readonly "animalId"[];
        candidateKeys: readonly (readonly "animalId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: "barksPerMinute"[];
        explicitDefaultValueColumns: readonly [];
        mutableColumns: readonly "barksPerMinute"[];
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly tsql.Table<{
        isLateral: false;
        alias: "animal";
        columns: {
            readonly appId: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "appId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly name: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly createdAt: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly animalId: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "animalId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly extinctAt: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "extinctAt";
                mapper: import("type-mapping").Mapper<unknown, Date | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "animalId";
        id: "animalId";
        primaryKey: readonly "animalId"[];
        candidateKeys: readonly (readonly "name"[] | readonly "animalId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: "extinctAt"[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly ("name" | "extinctAt")[];
        explicitAutoIncrementValueEnabled: false;
    }>[];
    autoIncrement: readonly "animalId"[];
    explicitAutoIncrementValueEnabled: readonly never[];
    insertAndFetchPrimaryKey: readonly never[];
}>;
export declare const catDogTpt: tsql.TablePerType<{
    childTable: tsql.Table<{
        isLateral: false;
        alias: "catDog";
        columns: {
            readonly name: tsql.Column<{
                tableAlias: "catDog";
                columnAlias: "name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly animalId: tsql.Column<{
                tableAlias: "catDog";
                columnAlias: "animalId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly barksPerMinute: tsql.Column<{
                tableAlias: "catDog";
                columnAlias: "barksPerMinute";
                mapper: import("type-mapping").Mapper<unknown, bigint | null>;
            }>;
            readonly headsOnSameEndOfBody: tsql.Column<{
                tableAlias: "catDog";
                columnAlias: "headsOnSameEndOfBody";
                mapper: import("type-mapping").Mapper<unknown, boolean>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: "animalId";
        primaryKey: readonly "animalId"[];
        candidateKeys: readonly (readonly "animalId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: "barksPerMinute"[];
        explicitDefaultValueColumns: readonly [];
        mutableColumns: readonly "headsOnSameEndOfBody"[];
        explicitAutoIncrementValueEnabled: false;
    }>;
    parentTables: readonly (tsql.Table<{
        isLateral: false;
        alias: "animal";
        columns: {
            readonly appId: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "appId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly name: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly createdAt: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "createdAt";
                mapper: import("type-mapping").Mapper<unknown, Date>;
            }>;
            readonly animalId: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "animalId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly extinctAt: tsql.Column<{
                tableAlias: "animal";
                columnAlias: "extinctAt";
                mapper: import("type-mapping").Mapper<unknown, Date | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: "animalId";
        id: "animalId";
        primaryKey: readonly "animalId"[];
        candidateKeys: readonly (readonly "name"[] | readonly "animalId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly never[];
        nullableColumns: "extinctAt"[];
        explicitDefaultValueColumns: readonly "createdAt"[];
        mutableColumns: readonly ("name" | "extinctAt")[];
        explicitAutoIncrementValueEnabled: false;
    }> | tsql.Table<{
        isLateral: false;
        alias: "cat";
        columns: {
            readonly name: tsql.Column<{
                tableAlias: "cat";
                columnAlias: "name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly animalId: tsql.Column<{
                tableAlias: "cat";
                columnAlias: "animalId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly purrFrequency: tsql.Column<{
                tableAlias: "cat";
                columnAlias: "purrFrequency";
                mapper: import("type-mapping").Mapper<unknown, number | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: "animalId";
        primaryKey: readonly "animalId"[];
        candidateKeys: readonly (readonly "animalId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: "purrFrequency"[];
        explicitDefaultValueColumns: readonly "purrFrequency"[];
        mutableColumns: readonly "purrFrequency"[];
        explicitAutoIncrementValueEnabled: false;
    }> | tsql.Table<{
        isLateral: false;
        alias: "dog";
        columns: {
            readonly name: tsql.Column<{
                tableAlias: "dog";
                columnAlias: "name";
                mapper: import("type-mapping").Mapper<unknown, string>;
            }>;
            readonly animalId: tsql.Column<{
                tableAlias: "dog";
                columnAlias: "animalId";
                mapper: import("type-mapping").Mapper<unknown, bigint>;
            }>;
            readonly barksPerMinute: tsql.Column<{
                tableAlias: "dog";
                columnAlias: "barksPerMinute";
                mapper: import("type-mapping").Mapper<unknown, bigint | null>;
            }>;
        };
        usedRef: tsql.IUsedRef<{}>;
        autoIncrement: undefined;
        id: "animalId";
        primaryKey: readonly "animalId"[];
        candidateKeys: readonly (readonly "animalId"[])[];
        insertEnabled: true;
        deleteEnabled: true;
        generatedColumns: readonly [];
        nullableColumns: "barksPerMinute"[];
        explicitDefaultValueColumns: readonly [];
        mutableColumns: readonly "barksPerMinute"[];
        explicitAutoIncrementValueEnabled: false;
    }>)[];
    autoIncrement: readonly "animalId"[];
    explicitAutoIncrementValueEnabled: readonly never[];
    insertAndFetchPrimaryKey: readonly never[];
}>;
