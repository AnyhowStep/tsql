/**
 * You will find a bunch of if-statements that have empty bodies,
 * with only comments in them.
 *
 * This is intentional.
 * We want to explicitly decide to handle or ignore an if-statement branch.
 */
import {ITable} from "../../../table";
import {TableMeta} from "../../../schema-introspection";
import {SchemaValidationResult, WritableSchemaValidationResult} from "../../schema-validation-result";
import {SchemaValidationErrorType} from "../../schema-validation-error";
import {KeyUtil} from "../../../key";
import {SchemaValidationWarningType} from "../../schema-validation-warning";
import {validateColumn} from "./validate-column";
import {escapeIdentifierWithDoubleQuotes} from "../../../sqlstring";

export function validateTable (
    applicationTable : ITable,
    tableMeta : TableMeta
) : SchemaValidationResult {
    const result : WritableSchemaValidationResult = {
        errors : [],
        warnings : [],
    };
    /**
     * Sanity check...
     */
    if (applicationTable.alias != tableMeta.tableAlias) {
        result.errors.push({
            type : SchemaValidationErrorType.TABLE_ALIAS_MISMATCH,
            description : `Application table is named ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}, database table is named ${escapeIdentifierWithDoubleQuotes(tableMeta.tableAlias)}`,
            applicationTableAlias : applicationTable.alias,
            databaseTableAlias : tableMeta.tableAlias,
        });
        return result;
    }

    /**
     * Primary key check
     */
    if (tableMeta.primaryKey == undefined) {
        if (applicationTable.primaryKey == undefined) {
            result.warnings.push({
                type : SchemaValidationWarningType.TABLE_HAS_NO_PRIMARY_KEY,
                description : `Table ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)} has no PRIMARY KEY`,
                tableAlias : applicationTable.alias,
            });
        } else {
            result.errors.push({
                type : SchemaValidationErrorType.PRIMARY_KEY_ON_APPLICATION_ONLY,
                description : `Table ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)} has PRIMARY KEY (${applicationTable.primaryKey.map(escapeIdentifierWithDoubleQuotes).join(", ")}) on application only`,
                tableAlias : applicationTable.alias,
                primaryKey : [...applicationTable.primaryKey],
            });
        }
    } else {
        if (applicationTable.primaryKey == undefined) {
            result.warnings.push({
                type : SchemaValidationWarningType.PRIMARY_KEY_ON_DATABASE_ONLY,
                description : `Table ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)} has PRIMARY KEY (${tableMeta.primaryKey.columnAliases.map(escapeIdentifierWithDoubleQuotes).join(", ")}) on database only`,
                tableAlias : applicationTable.alias,
                primaryKey : [...tableMeta.primaryKey.columnAliases],
            });
        } else {
            if (KeyUtil.isEqual(applicationTable.primaryKey, tableMeta.primaryKey.columnAliases)) {
                //OK, no problems here
            } else {
                result.errors.push({
                    type : SchemaValidationErrorType.PRIMARY_KEY_MISMATCH,
                    description : `Table ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)} has PRIMARY KEY (${applicationTable.primaryKey.map(escapeIdentifierWithDoubleQuotes).join(", ")}) on application, PRIMARY KEY (${tableMeta.primaryKey.columnAliases.map(escapeIdentifierWithDoubleQuotes).join(", ")}) on database`,
                    tableAlias : applicationTable.alias,
                    applicationPrimaryKey : [...applicationTable.primaryKey],
                    databasePrimaryKey : [...tableMeta.primaryKey.columnAliases],
                });
            }
        }
    }

    /**
     * Candidate keys check
     */
    const candidateKeysOnDatabaseOnly = tableMeta.candidateKeys.filter(candidateKeyMeta => {
        if (
            applicationTable.primaryKey != undefined &&
            KeyUtil.isEqual(applicationTable.primaryKey, candidateKeyMeta.columnAliases)
        ) {
            return false;
        }
        const applicationCandidateKey = applicationTable.candidateKeys.find(applicationCandidateKey => {
            return KeyUtil.isEqual(applicationCandidateKey, candidateKeyMeta.columnAliases);
        });
        return (applicationCandidateKey == undefined);
    });
    for (const candidateKey of candidateKeysOnDatabaseOnly) {
        result.warnings.push({
            type : SchemaValidationWarningType.CANDIDATE_KEY_ON_DATABASE_ONLY,
            description : `Table ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)} has CANDIDATE KEY (${candidateKey.columnAliases.join(", ")}) on database, not on application`,
            tableAlias : applicationTable.alias,
            candidateKey : [...candidateKey.columnAliases],
        });
    }

    const candidateKeysOnApplicationOnly = applicationTable.candidateKeys.filter(applicationCandidateKey => {
        const candidateKeyMeta = tableMeta.candidateKeys.find(candidateKeyMeta => {
            return KeyUtil.isEqual(applicationCandidateKey, candidateKeyMeta.columnAliases);
        });
        return (candidateKeyMeta == undefined);
    });
    for (const candidateKey of candidateKeysOnApplicationOnly) {
        result.errors.push({
            type : SchemaValidationErrorType.CANDIDATE_KEY_ON_APPLICATION_ONLY,
            description : `Table ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)} has CANDIDATE KEY (${candidateKey.join(", ")}) on application, not on database`,
            tableAlias : applicationTable.alias,
            candidateKey : [...candidateKey],
        });
    }

    /**
     * Tables should really have a candidate key...
     */
    if (tableMeta.primaryKey == undefined && tableMeta.candidateKeys.length == 0) {
        result.errors.push({
            type : SchemaValidationErrorType.DATABASE_TABLE_HAS_NO_PRIMARY_OR_CANDIDATE_KEY,
            description : `Table ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)} has no PRIMARY or CANDIDATE KEY on database`,
            tableAlias : applicationTable.alias,
        });
    }

    /**
     * There should only be zero or one auto-increment column on tables.
     * We validate them here.
     */
    const autoIncrementColumnMeta = tableMeta.columns.find(columnMeta => columnMeta.isAutoIncrement);
    if (autoIncrementColumnMeta == undefined) {
        if (applicationTable.autoIncrement == undefined) {
            /**
             * OK!
             */
        } else {
            /**
             * + The database has **no** auto-increment column.
             * + The application has an auto-increment column.
             *
             * -----
             *
             * + Attempts to `SELECT` are fine.
             * + Attempts to `INSERT` will fail because `.insertOne()` expects the auto-increment columns to be the same.
             * + Attempts to `UPDATE` are fine.
             * + Attempts to `DELETE` are fine.
             * + Attempts to use as expression are fine.
             */
            if (applicationTable.insertEnabled) {
                result.errors.push({
                    type : SchemaValidationErrorType.AUTO_INCREMENT_ON_APPLICATION_ONLY_INSERT_WILL_FAIL,
                    description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${applicationTable.autoIncrement} is auto-increment on application, not on database; INSERTs will fail`,
                    tableAlias : applicationTable.alias,
                    columnAlias : applicationTable.autoIncrement,
                });
            } else {
                result.warnings.push({
                    type : SchemaValidationWarningType.AUTO_INCREMENT_ON_APPLICATION_ONLY_INSERT_DISABLED,
                    description : `Column ${escapeIdentifierWithDoubleQuotes(applicationTable.alias)}.${applicationTable.autoIncrement} is auto-increment on application, not on database; however, INSERTs are disabled on the application`,
                    tableAlias : applicationTable.alias,
                    columnAlias : applicationTable.autoIncrement,
                });
            }
        }
    } else {
        if (applicationTable.autoIncrement == undefined) {
            result.warnings.push({
                type : SchemaValidationWarningType.AUTO_INCREMENT_ON_DATABASE_ONLY,
                description : `Column ${tableMeta.tableAlias}.${autoIncrementColumnMeta.columnAlias} is auto-increment on database, not on application`,
                tableAlias : tableMeta.tableAlias,
                columnAlias : autoIncrementColumnMeta.columnAlias,
            });
        } else {
            if (autoIncrementColumnMeta.columnAlias == applicationTable.autoIncrement) {
                /**
                 * OK!
                 */
            } else {
                /**
                 * The database and application disagree what the auto-increment column is.
                 *
                 * + Attempts to `SELECT` are fine.
                 * + Attempts to `INSERT` will fail because `.insertOne()` expects the auto-increment columns to be the same.
                 * + Attempts to `UPDATE` are fine.
                 * + Attempts to `DELETE` are fine.
                 * + Attempts to use as expression are fine.
                 */
                if (applicationTable.insertEnabled) {
                    result.errors.push({
                        type : SchemaValidationErrorType.AUTO_INCREMENT_MISMATCH_INSERT_WILL_FAIL,
                        description : `Column ${tableMeta.tableAlias}.${applicationTable.autoIncrement} is auto-increment on application, ${tableMeta.tableAlias}.${autoIncrementColumnMeta.columnAlias} is auto-increment on database; INSERTs will fail`,
                        tableAlias : tableMeta.tableAlias,
                        databaseColumnAlias : autoIncrementColumnMeta.columnAlias,
                        applicationColumnAlias : applicationTable.autoIncrement,
                    });
                } else {
                    result.warnings.push({
                        type : SchemaValidationWarningType.AUTO_INCREMENT_MISMATCH_INSERT_DISABLED,
                        description : `Column ${tableMeta.tableAlias}.${applicationTable.autoIncrement} is auto-increment on application, ${tableMeta.tableAlias}.${autoIncrementColumnMeta.columnAlias} is auto-increment on database; INSERTs will fail. However, INSERTs are disabled on the application`,
                        tableAlias : tableMeta.tableAlias,
                        databaseColumnAlias : autoIncrementColumnMeta.columnAlias,
                        applicationColumnAlias : applicationTable.autoIncrement,
                    });
                }
            }
        }
    }

    /**
     * Validate columns
     */
    for (const columnMeta of tableMeta.columns) {
        const applicationColumn = applicationTable.columns[columnMeta.columnAlias];
        if (applicationColumn == undefined) {
            if (applicationTable.insertEnabled) {
                if (
                    /**
                     * There's an implicit default/generated value
                     */
                    columnMeta.isNullable ||
                    columnMeta.isAutoIncrement ||
                    /**
                     * There's an explicit default/generated value
                     */
                    columnMeta.generationExpression != undefined ||
                    columnMeta.explicitDefaultValue != undefined
                ) {
                    /**
                     * + Database has column
                     * + Application **does not** have column
                     * + Database column has default/generated value
                     * + `INSERT` is enabled
                     *
                     * -----
                     *
                     * + Attempts to `SELECT` are fine.
                     * + Attempts to `INSERT` are fine; will just use default/generated value on database.
                     * + Attempts to `UPDATE` will never happen; does not exist on application.
                     * + Attempts to `DELETE` are fine.
                     * + Attempts to use as expression will never happen; does not exist on application.
                     *
                     */
                    result.warnings.push({
                        type : SchemaValidationWarningType.COLUMN_ON_DATABASE_ONLY_WITH_DEFAULT_OR_GENERATED_VALUE,
                        description : `Column ${tableMeta.tableAlias}.${columnMeta.columnAlias} exists on database, not on application; but has a default or generated value`,
                        databaseTableAlias : tableMeta.tableAlias,
                        databaseColumnAlias : columnMeta.columnAlias,
                        hasDefaultOrGeneratedValue : true,
                        insertEnabled : applicationTable.insertEnabled,
                    });
                } else {
                    /**
                     * + Database has column
                     * + Application **does not** have column
                     * + Database column **does not** have default/generated value
                     * + `INSERT` is enabled
                     *
                     * -----
                     *
                     * + Attempts to `SELECT` are fine.
                     * + Attempts to `INSERT` will fail; does not exist on application, and no default/generated value on database.
                     * + Attempts to `UPDATE` will never happen; does not exist on application.
                     * + Attempts to `DELETE` are fine.
                     * + Attempts to use as expression will never happen; does not exist on application.
                     *
                     */
                    result.errors.push({
                        type : SchemaValidationErrorType.COLUMN_ON_DATABASE_ONLY_INSERT_WILL_FAIL,
                        description : `Column ${tableMeta.tableAlias}.${columnMeta.columnAlias} exists on database, not on application; INSERTs will fail because the column has no default or generated value`,
                        databaseTableAlias : tableMeta.tableAlias,
                        databaseColumnAlias : columnMeta.columnAlias,
                        hasDefaultOrGeneratedValue : false,
                        insertEnabled : applicationTable.insertEnabled,
                    });
                }
            } else {
                /**
                 * + Database has column
                 * + Application **does not** have column
                 * + `INSERT` is disabled
                 *
                 * -----
                 *
                 * + Attempts to `SELECT` are fine.
                 * + Attempts to `INSERT` will never happen; it is disabled.
                 * + Attempts to `UPDATE` will never happen; does not exist on application.
                 * + Attempts to `DELETE` are fine.
                 * + Attempts to use as expression will never happen; does not exist on application.
                 *
                 */
                result.warnings.push({
                    type : SchemaValidationWarningType.COLUMN_ON_DATABASE_ONLY_INSERT_DISABLED,
                    description : `Column ${tableMeta.tableAlias}.${columnMeta.columnAlias} exists on database, not on application; but INSERT is disabled for the table`,
                    databaseTableAlias : tableMeta.tableAlias,
                    databaseColumnAlias : columnMeta.columnAlias,
                    insertEnabled : applicationTable.insertEnabled,
                });
            }
        } else {
            const validateColumnResult = validateColumn(
                applicationTable,
                applicationColumn,
                columnMeta
            );
            result.errors.push(...validateColumnResult.errors);
            result.warnings.push(...validateColumnResult.warnings);
        }
    }

    return result;
}
