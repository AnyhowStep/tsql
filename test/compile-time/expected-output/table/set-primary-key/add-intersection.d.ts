import * as sd from "type-mapping";
import * as o from "../../../../../dist";
export declare const joined1: o.Table<{
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
    autoIncrement: undefined;
    id: undefined;
    primaryKey: readonly ("b" | "y")[];
    candidateKeys: readonly (readonly ("y" | "c")[] | readonly ("b" | "y")[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly [];
    mutableColumns: readonly [];
}>;
