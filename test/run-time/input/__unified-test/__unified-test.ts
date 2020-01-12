import * as tape from "tape";
import * as tsql from "../../../../dist";
import {unifiedTest, UnifiedSchema} from "../../../../unified-test";
import {Pool} from "../sql-web-worker/promise.sql";
import {SqliteWorker} from "../sql-web-worker/worker.sql";
import {sqliteSqlfier} from "../../../sqlite-sqlfier";

unifiedTest({
    pool : new Pool(new SqliteWorker()),
    tape,
    createTemporarySchema : async (
        connection : tsql.IConnection,
        schema : UnifiedSchema
    ) : Promise<void> => {
        for (const table of schema.tables) {
            const tableSql : string[] = [`CREATE TABLE ${tsql.escapeIdentifierWithDoubleQuotes(table.tableAlias)} (`];

            let firstColumn = true;
            for (const column of table.columns) {
                const columnSql : string[] = [tsql.escapeIdentifierWithDoubleQuotes(column.columnAlias)];

                switch (column.dataType.typeHint) {
                    case tsql.TypeHint.BIGINT_SIGNED: {
                        columnSql.push("INTEGER");
                        break;
                    }
                    case tsql.TypeHint.BOOLEAN: {
                        columnSql.push("BOOLEAN");
                        break;
                    }
                    case tsql.TypeHint.BUFFER: {
                        columnSql.push("BLOB");
                        break;
                    }
                    case tsql.TypeHint.DATE_TIME: {
                        columnSql.push("DATETIME(3");
                        break;
                    }
                    case tsql.TypeHint.DECIMAL: {
                        columnSql.push("NUMERIC");
                        break;
                    }
                    case tsql.TypeHint.DOUBLE: {
                        columnSql.push("DOUBLE");
                        break;
                    }
                    case tsql.TypeHint.STRING: {
                        columnSql.push("TEXT");
                        break;
                    }
                }

                if (column.nullable !== true) {
                    columnSql.push("NOT NULL");
                }

                if (
                    table.primaryKey != undefined &&
                    !table.primaryKey.multiColumn &&
                    table.primaryKey.columnAlias == column.columnAlias
                ) {
                    if (table.primaryKey.autoIncrement) {
                        columnSql.push("PRIMARY KEY AUTOINCREMENT");
                    } else {
                        columnSql.push("PRIMARY KEY");
                    }
                }

                if (column.default != undefined) {
                    columnSql.push("DEFAULT");
                    columnSql.push(tsql.AstUtil.toSql(
                        tsql.BuiltInExprUtil.buildAst(column.default),
                        sqliteSqlfier
                    ));
                }

                if (!firstColumn) {
                    tableSql.push(", ");
                }
                firstColumn = false;
                tableSql.push(columnSql.join(" "));
            }

            if (
                table.primaryKey != undefined &&
                table.primaryKey.multiColumn
            ) {
                const columnAliases = table.primaryKey.columnAliases
                    .map(columnAlias => {
                        return tsql.escapeIdentifierWithDoubleQuotes(columnAlias);
                    })
                    .join(", ");
                tableSql.push(`, PRIMARY KEY (${columnAliases})`);
            }

            tableSql.push(");");

            await connection.rawQuery(tableSql.join(" "));
        }
    },
    fileNameLike : process.env.FILE_NAME_LIKE,
});
