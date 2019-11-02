import {ITable} from "../../../table";
import {IColumn} from "../../../column";
import {ColumnMeta} from "../../../schema-introspection";
import {WritableSchemaValidationResult, SchemaValidationResult} from "../../schema-validation-result";
import {SchemaValidationErrorType} from "../../schema-validation-error";
import {SchemaValidationWarningType} from "../../schema-validation-warning";
import {escapeIdentifierWithDoubleQuotes} from "../../../sqlstring";

export function validateColumn (
    applicationTable : Pick<
        ITable,
        (
            | "nullableColumns"
            | "mutableColumns"
            | "generatedColumns"
            | "explicitDefaultValueColumns"
            | "alias"
            | "autoIncrement"
            | "insertEnabled"
        )
    >,
    applicationColumn : Pick<IColumn, "columnAlias">,
    columnMeta : ColumnMeta
) : SchemaValidationResult {
    const result : WritableSchemaValidationResult = {
        errors : [],
        warnings : [],
    };
    /**
     * Sanity check...
     */
    if (applicationColumn.columnAlias != columnMeta.columnAlias) {
        result.errors.push({
            type : SchemaValidationErrorType.COLUMN_ALIAS_MISMATCH,
            description : `Application column is named ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)}, database column is named ${applicationTable.alias}.${columnMeta.columnAlias}`,
            tableAlias : applicationTable.alias,
            applicationColumnAlias : applicationColumn.columnAlias,
            databaseColumnAlias : columnMeta.columnAlias,
        });
        return result;
    }

    const applicationNullable = applicationTable.nullableColumns.includes(columnMeta.columnAlias);
    const applicationMutable = applicationTable.mutableColumns.includes(applicationColumn.columnAlias);
    const applicationAutoIncrement = (
        applicationTable.autoIncrement != undefined &&
        applicationTable.autoIncrement == applicationColumn.columnAlias
    );
    const applicationGenerated = applicationTable.generatedColumns.includes(applicationColumn.columnAlias);
    const applicationExplicitDefaultValue = applicationTable.explicitDefaultValueColumns.includes(applicationColumn.columnAlias);

    if (columnMeta.isNullable) {
        if (applicationNullable) {
            /**
             * OK
             */
        } else {
            /**
             * + Database is nullable.
             * + Application is **not** nullable.
             *
             * -----
             *
             * + Attempts to `SELECT` the `NULL` value will fail.
             * + Attempts to `INSERT` are fine.
             * + Attempts to `UPDATE` are fine.
             * + Attempts to `DELETE` are fine.
             * + Attempts to use as expression expecting non-`NULL` will fail.
             *
             */
            result.errors.push({
                type : SchemaValidationErrorType.COLUMN_NULLABLE_ON_DATABASE_ONLY,
                description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is nullable on database only; SELECTs will fail`,
                tableAlias : applicationTable.alias,
                columnAlias : applicationColumn.columnAlias,
            });
        }
    } else {
        if (applicationNullable) {
            /**
             * + Database is **not** nullable.
             * + Application is nullable.
             *
             * -----
             *
             * + Attempts to `SELECT` are fine.
             * + Attempts to `INSERT` the `NULL` value will fail.
             * + Attempts to `UPDATE` to the `NULL` value will fail.
             * + Attempts to `DELETE` are fine.
             * + Attempts to use as expression expecting nullable are fine.
             *
             */
            if (applicationTable.insertEnabled) {
                result.errors.push({
                    type : SchemaValidationErrorType.COLUMN_NULLABLE_ON_APPLICATION_ONLY_INSERT_WILL_FAIL,
                    description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is nullable on application only; INSERTs using NULL value will fail`,
                    tableAlias : applicationTable.alias,
                    columnAlias : applicationColumn.columnAlias,
                });
            } else if (applicationMutable) {
                result.errors.push({
                    type : SchemaValidationErrorType.COLUMN_NULLABLE_ON_APPLICATION_ONLY_UPDATE_WILL_FAIL,
                    description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is nullable on application only; UPDATEs using NULL value will fail`,
                    tableAlias : applicationTable.alias,
                    columnAlias : applicationColumn.columnAlias,
                });
            } else {
                result.warnings.push({
                    type : SchemaValidationWarningType.COLUMN_NULLABLE_ON_APPLICATION_ONLY_INSERT_AND_UPDATE_DISABLED,
                    description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is nullable on application only; INSERTs and UPDATEs using NULL value will fail but both are disabled`,
                    tableAlias : applicationTable.alias,
                    columnAlias : applicationColumn.columnAlias,
                });
            }
        } else {
            /**
             * OK
             */
        }
    }

    if (columnMeta.generationExpression != undefined) {
        if (applicationGenerated) {
            /**
             * OK
             */
        } else {
            /**
             * + This column is generated on the database
             * + This column is **not** generated on the application
             *
             * -----
             *
             * + Attempts to `SELECT` are fine.
             * + Attempts to `INSERT` will fail because you cannot set values for generated columns.
             * + Attsmpts to `UPDATE` will fail because you cannot set values for generated columns.
             * + Attempts to `DELETE` are fine.
             * + Attempts to use as expression are fine.
             */
            if (applicationTable.insertEnabled) {
                result.errors.push({
                    type : SchemaValidationErrorType.COLUMN_GENERATED_ON_DATABASE_ONLY_INSERT_WILL_FAIL,
                    description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is nullable on application only; INSERTs using NULL value will fail`,
                    tableAlias : applicationTable.alias,
                    columnAlias : applicationColumn.columnAlias,
                });
            } else if (applicationMutable) {
                result.errors.push({
                    type : SchemaValidationErrorType.COLUMN_GENERATED_ON_DATABASE_ONLY_UPDATE_WILL_FAIL,
                    description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is nullable on application only; UPDATEs using NULL value will fail`,
                    tableAlias : applicationTable.alias,
                    columnAlias : applicationColumn.columnAlias,
                });
            } else {
                result.warnings.push({
                    type : SchemaValidationWarningType.COLUMN_GENERATED_ON_DATABASE_ONLY_INSERT_AND_UPDATE_DISABLED,
                    description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is nullable on application only; however, the column value cannot be set to NULL through INSERT and UPDATE statements`,
                    tableAlias : applicationTable.alias,
                    columnAlias : applicationColumn.columnAlias,
                });
            }
        }
    } else {
        if (applicationGenerated) {
            if (applicationAutoIncrement) {
                /**
                 * On application code, we implicitly add auto-increment columns
                 * to the list of generated columns, even though they're not really
                 * generated columns...
                 */
                if (columnMeta.isAutoIncrement) {
                    /**
                     * + Attempts to `SELECT` are fine.
                     * + Attempts to `INSERT` are fine; the auto-increment modifier matches.
                     * + Attempts to `UPDATE` won't set the value because we say it is generated.
                     * + Attempts to `DELETE` are fine.
                     * + Attempts to use as expression are fine.
                     */
                    /**
                     * OK
                     */
                } else {
                    /**
                     * + Attempts to `SELECT` are fine.
                     * + Attempts to `INSERT` will fail; the auto-increment modifiers don't match.
                     * + Attempts to `UPDATE` won't set the value because we say it is generated.
                     * + Attempts to `DELETE` are fine.
                     * + Attempts to use as expression are fine.
                     */
                    if (applicationTable.insertEnabled) {
                        result.errors.push({
                            type : SchemaValidationErrorType.COLUMN_GENERATED_ON_APPLICATION_ONLY_AUTO_INCREMENT_MISMATCH_INSERT_WILL_FAIL,
                            description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is auto-increment on application, not auto-increment on database; INSERTs will fail`,
                            tableAlias : applicationTable.alias,
                            columnAlias : applicationColumn.columnAlias,
                        });
                    } else {
                        result.warnings.push({
                            type : SchemaValidationWarningType.COLUMN_GENERATED_ON_APPLICATION_ONLY_AUTO_INCREMENT_MISMATCH_INSERT_DISABLED,
                            description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is auto-increment on application, not auto-increment on database; INSERTs will fail. However, INSERTs are disabled`,
                            tableAlias : applicationTable.alias,
                            columnAlias : applicationColumn.columnAlias,
                        });
                    }
                }
            } else {
                if (
                    columnMeta.isNullable ||
                    columnMeta.isAutoIncrement ||
                    columnMeta.explicitDefaultValue != undefined
                ) {
                    /**
                     * + This column has an implicit/explicit default/generated value on the database
                     *
                     * So, we can kind of pretend it's generated on application code, anyway.
                     *
                     * + Attempts to `SELECT` are fine.
                     * + Attempts to `INSERT` won't set the value because we say it is generated.
                     * + Attempts to `UPDATE` won't set the value because we say it is generated.
                     * + Attempts to `DELETE` are fine.
                     * + Attempts to use as expression are fine.
                     */
                    result.warnings.push({
                        type : SchemaValidationWarningType.COLUMN_GENERATED_ON_APPLICATION_ONLY_USING_DATABASE_DEFAULT_VALUE,
                        description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is generated on application, not generated on database; but the database default value is used`,
                        tableAlias : applicationTable.alias,
                        columnAlias : applicationColumn.columnAlias,
                    });
                } else {
                    /**
                     * We say it is generated on application code.
                     * But it has **no** default/generated value on the database.
                     *
                     * + Attempts to `SELECT` are fine.
                     * + Attempts to `INSERT` will fail because we cannot set the value on application code,
                     *   and there is no default/generated value on the database.
                     * + Attempts to `UPDATE` won't set the value because we say it is generated.
                     * + Attempts to `DELETE` are fine.
                     * + Attempts to use as expression are fine.
                     */
                    if (applicationTable.insertEnabled) {
                        result.errors.push({
                            type : SchemaValidationErrorType.COLUMN_GENERATED_ON_APPLICATION_ONLY_INSERT_WILL_FAIL,
                            description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is generated on application only; INSERTs will fail`,
                            tableAlias : applicationTable.alias,
                            columnAlias : applicationColumn.columnAlias,
                        });
                    } else {
                        result.warnings.push({
                            type : SchemaValidationWarningType.COLUMN_GENERATED_ON_APPLICATION_ONLY_INSERT_DISABLED,
                            description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} is generated on application only; INSERTs will fail but INSERTs are disabled`,
                            tableAlias : applicationTable.alias,
                            columnAlias : applicationColumn.columnAlias,
                        });
                    }
                }
            }
        } else {
            /**
             * OK
             */
        }
    }

    if (columnMeta.explicitDefaultValue != undefined) {
        if (applicationExplicitDefaultValue) {
            /**
             * OK
             */
        } else {
            /**
             * It has an explicit default value on the database.
             * But not on application code.
             *
             * + Attempts to `SELECT` are fine.
             * + Attempts to `INSERT` are fine; they just cannot use the default value.
             * + Attempts to `UPDATE` are fine.
             * + Attempts to `DELETE` are fine.
             * + Attempts to use as expression are fine.
             */
            result.warnings.push({
                type : SchemaValidationWarningType.COLUMN_EXPLICIT_DEFAULT_VALUE_ON_DATABASE_ONLY,
                description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} has explicit default value on database only`,
                tableAlias : applicationTable.alias,
                columnAlias : applicationColumn.columnAlias,
                explicitDefaultValue : columnMeta.explicitDefaultValue,
            });
        }
    } else {
        if (applicationExplicitDefaultValue) {
            if (
                columnMeta.isNullable ||
                columnMeta.isAutoIncrement ||
                columnMeta.generationExpression != undefined
            ) {
                /**
                 * It **does not** have an explicit default value on the database.
                 * But it does, on application code.
                 *
                 * However, it does have other default/generated values on the database...
                 *
                 * + Attempts to `SELECT` are fine.
                 * + Attempts to `INSERT` are fine; they will just use the other default/generated values on the database.
                 * + Attempts to `UPDATE` are fine.
                 * + Attempts to `DELETE` are fine.
                 * + Attempts to use as expression are fine.
                 */
                result.warnings.push({
                    type : SchemaValidationWarningType.COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_USING_DATABASE_GENERATED_OR_NULL_VALUE,
                    description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} has explicit default value on application only; INSERTs will use database generated or NULL value`,
                    tableAlias : applicationTable.alias,
                    columnAlias : applicationColumn.columnAlias,
                    isNullable : columnMeta.isNullable,
                    isAutoIncrement : columnMeta.isAutoIncrement,
                    generationExpression : columnMeta.generationExpression,
                    explicitDefaultValue : columnMeta.explicitDefaultValue,
                });
            } else {
                /**
                 * It **does not** have an explicit default value on the database.
                 * But it does, on application code.
                 *
                 * There are also no other default/generated values on the database...
                 *
                 * + Attempts to `SELECT` are fine.
                 * + Attempts to `INSERT` will fail; there is no default/generated value on the database to use.
                 * + Attempts to `UPDATE` are fine.
                 * + Attempts to `DELETE` are fine.
                 * + Attempts to use as expression are fine.
                 */
                if (applicationTable.insertEnabled) {
                    result.errors.push({
                        type : SchemaValidationErrorType.COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_INSERT_WILL_FAIL,
                        description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} has explicit default value on application only; INSERTs will fail`,
                        tableAlias : applicationTable.alias,
                        columnAlias : applicationColumn.columnAlias,
                    });
                } else {
                    result.warnings.push({
                        type : SchemaValidationWarningType.COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_INSERT_DISABLED,
                        description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${escapeIdentifierWithDoubleQuotes(applicationColumn.columnAlias)} has explicit default value on application only; INSERTs will fail but INSERTs are disabled`,
                        tableAlias : applicationTable.alias,
                        columnAlias : applicationColumn.columnAlias,
                    });
                }
            }
        } else {
            /**
             * OK
             */
        }
    }

    return result;
}
