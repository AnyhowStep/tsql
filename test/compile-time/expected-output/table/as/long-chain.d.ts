import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";
export declare const aliasedTable: tsql.Table<{
    isLateral: false;
    alias: "21";
    columns: {
        readonly myTableId: tsql.Column<{
            tableAlias: "21";
            columnAlias: "myTableId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly column0: tsql.Column<{
            tableAlias: "21";
            columnAlias: "column0";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly column1: tsql.Column<{
            tableAlias: "21";
            columnAlias: "column1";
            mapper: tm.Mapper<unknown, Buffer>;
        }>;
        readonly column2: tsql.Column<{
            tableAlias: "21";
            columnAlias: "column2";
            mapper: tm.Mapper<unknown, Date>;
        }>;
        readonly column3: tsql.Column<{
            tableAlias: "21";
            columnAlias: "column3";
            mapper: tm.Mapper<unknown, number>;
        }>;
        readonly column4: tsql.Column<{
            tableAlias: "21";
            columnAlias: "column4";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly column5: tsql.Column<{
            tableAlias: "21";
            columnAlias: "column5";
            mapper: tm.Mapper<unknown, boolean>;
        }>;
        readonly column6: tsql.Column<{
            tableAlias: "21";
            columnAlias: "column6";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly column7: tsql.Column<{
            tableAlias: "21";
            columnAlias: "column7";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly column8: tsql.Column<{
            tableAlias: "21";
            columnAlias: "column8";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly column9: tsql.Column<{
            tableAlias: "21";
            columnAlias: "column9";
            mapper: tm.Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: undefined;
    primaryKey: undefined;
    candidateKeys: readonly [];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly [];
    mutableColumns: readonly [];
}>;
/**
 * The type of `columns.column0.columnAlias` is all messed up.
 * No max-depth error, though.
 *
 * https://github.com/microsoft/TypeScript/issues/32707 might be related.
 *
 * 1. Mouse over `aliasedTable`, resolves correctly
 * 2. Mouse over `aliasedTable2`, resolves to any
 * 3. Mouse over `aliasedTable`, resolve to any <-- Wtf?
 * 4. Compile
 * 5. `aliasedTable` emits correctly
 * 6. `aliasedTable2` emits correctly <-- Wtf?
 */
export declare const aliasedTable2: tsql.Table<{
    isLateral: false;
    alias: "22";
    columns: {
        readonly myTableId: tsql.Column<{
            tableAlias: "22";
            columnAlias: "myTableId";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly column0: tsql.Column<{
            tableAlias: "22";
            columnAlias: "column0";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly column1: tsql.Column<{
            tableAlias: "22";
            columnAlias: "column1";
            mapper: tm.Mapper<unknown, Buffer>;
        }>;
        readonly column2: tsql.Column<{
            tableAlias: "22";
            columnAlias: "column2";
            mapper: tm.Mapper<unknown, Date>;
        }>;
        readonly column3: tsql.Column<{
            tableAlias: "22";
            columnAlias: "column3";
            mapper: tm.Mapper<unknown, number>;
        }>;
        readonly column4: tsql.Column<{
            tableAlias: "22";
            columnAlias: "column4";
            mapper: tm.Mapper<unknown, bigint>;
        }>;
        readonly column5: tsql.Column<{
            tableAlias: "22";
            columnAlias: "column5";
            mapper: tm.Mapper<unknown, boolean>;
        }>;
        readonly column6: tsql.Column<{
            tableAlias: "22";
            columnAlias: "column6";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly column7: tsql.Column<{
            tableAlias: "22";
            columnAlias: "column7";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly column8: tsql.Column<{
            tableAlias: "22";
            columnAlias: "column8";
            mapper: tm.Mapper<unknown, string>;
        }>;
        readonly column9: tsql.Column<{
            tableAlias: "22";
            columnAlias: "column9";
            mapper: tm.Mapper<unknown, string>;
        }>;
    };
    usedRef: tsql.IUsedRef<{}>;
    autoIncrement: undefined;
    id: undefined;
    primaryKey: undefined;
    candidateKeys: readonly [];
    insertEnabled: true;
    deleteEnabled: true;
    generatedColumns: readonly [];
    nullableColumns: never[];
    explicitDefaultValueColumns: readonly [];
    mutableColumns: readonly [];
}>;
