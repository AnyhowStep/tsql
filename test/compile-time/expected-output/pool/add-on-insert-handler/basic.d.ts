import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
export declare const joined1: tsql.Table<{
    isLateral: false;
    alias: "joined1";
    columns: {
        readonly a: tsql.Column<{
            tableAlias: "joined1";
            columnAlias: "a";
            mapper: tm.Mapper<unknown, Date>;
        }>;
        readonly b: tsql.Column<{
            tableAlias: "joined1";
            columnAlias: "b";
            mapper: tm.Mapper<unknown, number>;
        }>;
        readonly y: tsql.Column<{
            tableAlias: "joined1";
            columnAlias: "y";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly c: tsql.Column<{
            tableAlias: "joined1";
            columnAlias: "c";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly d: tsql.Column<{
            tableAlias: "joined1";
            columnAlias: "d";
            mapper: tm.Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: undefined;
    primaryKey: undefined;
    candidateKeys: readonly (readonly ("y" | "c")[] | readonly "b"[])[];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly [];
    mutableColumns: readonly [];
    explicitAutoIncrementValueEnabled: false;
}>;
