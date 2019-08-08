import * as sd from "type-mapping";
import * as o from "../../../../../dist";
export declare const ai: import("../../../../../dist/table/table-impl").Table<{
    isLateral: false;
    alias: "joined1";
    columns: {
        readonly a: o.Column<{
            tableAlias: "joined1";
            columnAlias: "a";
            mapper: sd.Mapper<unknown, Date>;
        }>;
        readonly b: o.Column<{
            tableAlias: "joined1";
            columnAlias: "b";
            mapper: sd.Mapper<unknown, number>;
        }>;
        readonly y: o.Column<{
            tableAlias: "joined1";
            columnAlias: "y";
            mapper: sd.Mapper<unknown, string>;
        }>;
        readonly c: o.Column<{
            tableAlias: "joined1";
            columnAlias: "c";
            mapper: sd.Mapper<unknown, string>;
        }>;
        readonly d: o.Column<{
            tableAlias: "joined1";
            columnAlias: "d";
            mapper: sd.Mapper<unknown, string>;
        }>;
    };
    usedRef: o.IUsedRef<{}>;
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
