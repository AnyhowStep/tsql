
export enum SchemaValidationWarningType {
    TABLE_ON_DATABASE_ONLY = "TABLE_ON_DATABASE_ONLY",

    TABLE_HAS_NO_PRIMARY_KEY = "TABLE_HAS_NO_PRIMARY_KEY",
    PRIMARY_KEY_ON_DATABASE_ONLY = "PRIMARY_KEY_ON_DATABASE_ONLY",

    CANDIDATE_KEY_ON_DATABASE_ONLY = "CANDIDATE_KEY_ON_DATABASE_ONLY",

    COLUMN_ON_DATABASE_ONLY_WITH_DEFAULT_OR_GENERATED_VALUE = "COLUMN_ON_DATABASE_ONLY_WITH_DEFAULT_OR_GENERATED_VALUE",
    COLUMN_ON_DATABASE_ONLY_INSERT_DISABLED = "COLUMN_ON_DATABASE_ONLY_INSERT_DISABLED",

    AUTO_INCREMENT_ON_APPLICATION_ONLY_INSERT_DISABLED = "AUTO_INCREMENT_ON_APPLICATION_ONLY_INSERT_DISABLED",
    AUTO_INCREMENT_ON_DATABASE_ONLY = "AUTO_INCREMENT_ON_DATABASE_ONLY",
    AUTO_INCREMENT_MISMATCH_INSERT_DISABLED = "AUTO_INCREMENT_MISMATCH_INSERT_DISABLED",

    COLUMN_NULLABLE_ON_APPLICATION_ONLY_INSERT_AND_UPDATE_DISABLED = "COLUMN_NULLABLE_ON_APPLICATION_ONLY_INSERT_AND_UPDATE_DISABLED",

    COLUMN_GENERATED_ON_DATABASE_ONLY_INSERT_AND_UPDATE_DISABLED = "COLUMN_GENERATED_ON_DATABASE_ONLY_INSERT_AND_UPDATE_DISABLED",
    COLUMN_GENERATED_ON_APPLICATION_ONLY_AUTO_INCREMENT_MISMATCH_INSERT_DISABLED = "COLUMN_GENERATED_ON_APPLICATION_ONLY_AUTO_INCREMENT_MISMATCH_INSERT_DISABLED",
    COLUMN_GENERATED_ON_APPLICATION_ONLY_USING_DATABASE_DEFAULT_VALUE = "COLUMN_GENERATED_ON_APPLICATION_ONLY_USING_DATABASE_DEFAULT_VALUE",
    COLUMN_GENERATED_ON_APPLICATION_ONLY_INSERT_DISABLED = "COLUMN_GENERATED_ON_APPLICATION_ONLY_INSERT_DISABLED",

    COLUMN_EXPLICIT_DEFAULT_VALUE_ON_DATABASE_ONLY = "COLUMN_EXPLICIT_DEFAULT_VALUE_ON_DATABASE_ONLY",
    COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_USING_DATABASE_GENERATED_VALUE_OR_NULLABLE = "COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_USING_DATABASE_GENERATED_VALUE_OR_NULLABLE",
    COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_INSERT_DISABLED = "COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_INSERT_DISABLED",
}

export interface TableOnDatabaseOnlyWarning {
    type : SchemaValidationWarningType.TABLE_ON_DATABASE_ONLY,
    description : string,
    databaseTableAlias : string,
}

export interface TableHasNoPrimaryKeyWarning {
    type : SchemaValidationWarningType.TABLE_HAS_NO_PRIMARY_KEY,
    description : string,
    tableAlias : string,
}
export interface PrimaryKeyOnDatabaseOnlyWarning {
    type : SchemaValidationWarningType.PRIMARY_KEY_ON_DATABASE_ONLY,
    description : string,
    tableAlias : string,
    primaryKey : readonly string[],
}

export interface CandidateKeyOnDatabaseOnlyWarning {
    type : SchemaValidationWarningType.CANDIDATE_KEY_ON_DATABASE_ONLY,
    description : string,
    tableAlias : string,
    candidateKey : readonly string[],
}

export interface ColumnOnDatabaseOnlyWithDefaultOrGeneratedValueWarning {
    type : SchemaValidationWarningType.COLUMN_ON_DATABASE_ONLY_WITH_DEFAULT_OR_GENERATED_VALUE,
    description : string,
    databaseTableAlias : string,
    databaseColumnAlias : string,
    hasDefaultOrGeneratedValue : true,
    insertEnabled : true,
}

export interface ColumnOnDatabaseOnlyInsertDisabledWarning {
    type : SchemaValidationWarningType.COLUMN_ON_DATABASE_ONLY_INSERT_DISABLED,
    description : string,
    databaseTableAlias : string,
    databaseColumnAlias : string,
    insertEnabled : false,
}

export interface AutoIncrementOnApplicationOnlyInsertDisabledWarning {
    type : SchemaValidationWarningType.AUTO_INCREMENT_ON_APPLICATION_ONLY_INSERT_DISABLED,
    description : string,
    tableAlias : string,
    columnAlias : string,
}

export interface AutoIncrementOnDatabaseOnlyWarning {
    type : SchemaValidationWarningType.AUTO_INCREMENT_ON_DATABASE_ONLY,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface AutoIncrementMismatchInsertDisabledWarning {
    type : SchemaValidationWarningType.AUTO_INCREMENT_MISMATCH_INSERT_DISABLED,
    description : string,
    tableAlias : string,
    applicationColumnAlias : string,
    databaseColumnAlias : string,
}

export interface ColumnNullableOnApplicationOnlyInsertAndUpdateDisabledWarning {
    type : SchemaValidationWarningType.COLUMN_NULLABLE_ON_APPLICATION_ONLY_INSERT_AND_UPDATE_DISABLED,
    description : string,
    tableAlias : string,
    columnAlias : string,
}

export interface ColumnGeneratedOnDatabaseOnlyInsertAndUpdateDisabledWarning {
    type : SchemaValidationWarningType.COLUMN_GENERATED_ON_DATABASE_ONLY_INSERT_AND_UPDATE_DISABLED,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface ColumnGeneratedOnApplicationOnlyAutoIncrementMismatchInsertDisabledWarning {
    type : SchemaValidationWarningType.COLUMN_GENERATED_ON_APPLICATION_ONLY_AUTO_INCREMENT_MISMATCH_INSERT_DISABLED,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface ColumnGeneratedOnApplicationOnlyUsingDatabaseDefaultValueWarning {
    type : SchemaValidationWarningType.COLUMN_GENERATED_ON_APPLICATION_ONLY_USING_DATABASE_DEFAULT_VALUE,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface ColumnGeneratedOnApplicationOnlyInsertDisabledWarning {
    type : SchemaValidationWarningType.COLUMN_GENERATED_ON_APPLICATION_ONLY_INSERT_DISABLED,
    description : string,
    tableAlias : string,
    columnAlias : string,
}

export interface ColumnExplicitDefaultValueOnDatabaseOnlyWarning {
    type : SchemaValidationWarningType.COLUMN_EXPLICIT_DEFAULT_VALUE_ON_DATABASE_ONLY,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface ColumnExplicitDefaultValueOnApplicationOnlyUsingDatabaseGeneratedValueOrNullableWarning {
    type : SchemaValidationWarningType.COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_USING_DATABASE_GENERATED_VALUE_OR_NULLABLE,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface ColumnExplicitDefaultValueOnApplicationOnlyInsertDisabledWarning {
    type : SchemaValidationWarningType.COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_INSERT_DISABLED,
    description : string,
    tableAlias : string,
    columnAlias : string,
}

export type SchemaValidationWarning =
    | TableOnDatabaseOnlyWarning

    | TableHasNoPrimaryKeyWarning
    | PrimaryKeyOnDatabaseOnlyWarning

    | CandidateKeyOnDatabaseOnlyWarning

    | ColumnOnDatabaseOnlyWithDefaultOrGeneratedValueWarning
    | ColumnOnDatabaseOnlyInsertDisabledWarning

    | AutoIncrementOnApplicationOnlyInsertDisabledWarning
    | AutoIncrementOnDatabaseOnlyWarning
    | AutoIncrementMismatchInsertDisabledWarning

    | ColumnNullableOnApplicationOnlyInsertAndUpdateDisabledWarning

    | ColumnGeneratedOnDatabaseOnlyInsertAndUpdateDisabledWarning
    | ColumnGeneratedOnApplicationOnlyAutoIncrementMismatchInsertDisabledWarning
    | ColumnGeneratedOnApplicationOnlyUsingDatabaseDefaultValueWarning
    | ColumnGeneratedOnApplicationOnlyInsertDisabledWarning

    | ColumnExplicitDefaultValueOnDatabaseOnlyWarning
    | ColumnExplicitDefaultValueOnApplicationOnlyUsingDatabaseGeneratedValueOrNullableWarning
    | ColumnExplicitDefaultValueOnApplicationOnlyInsertDisabledWarning
;
