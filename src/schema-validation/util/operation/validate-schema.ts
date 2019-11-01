import {ITable} from "../../../table";
import {SchemaMeta} from "../../../schema-introspection";
import {SchemaValidationResult, WritableSchemaValidationResult} from "../../schema-validation-result";
import {SchemaValidationWarningType} from "../../schema-validation-warning";
import {validateTable} from "./validate-table";
import {SchemaValidationErrorType} from "../../schema-validation-error";

export function validateSchema (
    applicationTables : readonly ITable[],
    schemaMeta : SchemaMeta
) : SchemaValidationResult {
    const result : WritableSchemaValidationResult = {
        errors : [],
        warnings : [],
    };

    const tablesOnDatabaseOnly = schemaMeta.tables.filter(tableMeta => {
        const applicationTable = applicationTables.find(
            applicationTable => applicationTable.alias == tableMeta.tableAlias
        );
        return (applicationTable == undefined);
    });
    for (const tableMeta of tablesOnDatabaseOnly) {
        result.warnings.push({
            type : SchemaValidationWarningType.TABLE_ON_DATABASE_ONLY,
            description : `Table ${tableMeta.tableAlias} exists on database, not on application`,
            databaseTableAlias : tableMeta.tableAlias,
        });
    }

    const tablesOnApplicationOnly = applicationTables.filter(applicationTable => {
        const tableMeta = schemaMeta.tables.find(
            tableMeta => applicationTable.alias == tableMeta.tableAlias
        );
        return (tableMeta == undefined);
    });
    for (const applicationTable of tablesOnApplicationOnly) {
        result.errors.push({
            type : SchemaValidationErrorType.TABLE_ON_APPLICATION_ONLY,
            description : `Table ${applicationTable.alias} exists on application, not on database`,
            applicationTableAlias : applicationTable.alias,
        });
    }

    for (const applicationTable of applicationTables) {
        const tableMeta = schemaMeta.tables.find(
            tableMeta => tableMeta.tableAlias == applicationTable.alias
        );
        if (tableMeta == undefined) {
            continue;
        }

        const validateTableResult = validateTable(applicationTable, tableMeta);
        result.errors.push(...validateTableResult.errors);
        result.warnings.push(...validateTableResult.warnings);
    }

    return result;
}
