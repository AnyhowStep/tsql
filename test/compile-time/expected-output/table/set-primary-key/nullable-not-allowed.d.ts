import * as sd from "type-mapping";
import * as o from "../../../../../dist";
export declare const t: import("../../../../../dist/table/table-impl").Table<{
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
            mapper: sd.Mapper<unknown, string | null>;
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
    usedRef: o.IUsedRef<{}>;
    autoIncrement: undefined;
    id: undefined;
    primaryKey: readonly any[];
    candidateKeys: readonly (readonly any[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: "y"[];
    explicitDefaultValueColumns: readonly [];
    mutableColumns: readonly [];
    parents: readonly [];
}>;
