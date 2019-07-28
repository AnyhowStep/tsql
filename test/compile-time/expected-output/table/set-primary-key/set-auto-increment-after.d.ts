import * as sd from "type-mapping";
export declare const ai: import("../../../../../dist/table/table-impl").Table<{
    lateral: false;
    tableAlias: "joined1";
    columns: {
        readonly a: import("../../../../../dist/column").Column<{
            tableAlias: "joined1";
            columnAlias: "a";
            mapper: sd.Mapper<unknown, Date>;
        }>;
        readonly b: import("../../../../../dist/column").Column<{
            tableAlias: "joined1";
            columnAlias: "b";
            mapper: sd.Mapper<unknown, number>;
        }>;
        readonly y: import("../../../../../dist/column").Column<{
            tableAlias: "joined1";
            columnAlias: "y";
            mapper: sd.Mapper<unknown, string>;
        }>;
        readonly c: import("../../../../../dist/column").Column<{
            tableAlias: "joined1";
            columnAlias: "c";
            mapper: sd.Mapper<unknown, string>;
        }>;
        readonly d: import("../../../../../dist/column").Column<{
            tableAlias: "joined1";
            columnAlias: "d";
            mapper: sd.Mapper<unknown, string>;
        }>;
    };
    usedRef: {};
    autoIncrement: "b";
    id: "b";
    primaryKey: readonly "b"[];
    candidateKeys: readonly (readonly "b"[] | readonly "y"[] | readonly ("c" | "d")[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly "b"[];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly never[];
    mutableColumns: readonly never[];
    parents: readonly [];
}>;
