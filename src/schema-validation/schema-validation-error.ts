
export enum SchemaValidationErrorType {
    TABLE_ON_APPLICATION_ONLY = "TABLE_ON_APPLICATION_ONLY",
    TABLE_ALIAS_MISMATCH = "TABLE_ALIAS_MISMATCH",

    PRIMARY_KEY_ON_APPLICATION_ONLY = "PRIMARY_KEY_ON_APPLICATION_ONLY",
    PRIMARY_KEY_MISMATCH = "PRIMARY_KEY_MISMATCH",

    CANDIDATE_KEY_ON_APPLICATION_ONLY = "CANDIDATE_KEY_ON_APPLICATION_ONLY",

    DATABASE_TABLE_HAS_NO_PRIMARY_OR_CANDIDATE_KEY = "DATABASE_TABLE_HAS_NO_PRIMARY_OR_CANDIDATE_KEY",

    COLUMN_ON_DATABASE_ONLY_INSERT_WILL_FAIL = "COLUMN_ON_DATABASE_ONLY_INSERT_WILL_FAIL",
    COLUMN_ON_APPLICATION_ONLY = "COLUMN_ON_APPLICATION_ONLY",

    COLUMN_ALIAS_MISMATCH = "COLUMN_ALIAS_MISMATCH",

    AUTO_INCREMENT_ON_APPLICATION_ONLY_INSERT_WILL_FAIL = "AUTO_INCREMENT_ON_APPLICATION_ONLY_INSERT_WILL_FAIL",
    AUTO_INCREMENT_MISMATCH_INSERT_WILL_FAIL = "AUTO_INCREMENT_MISMATCH_INSERT_WILL_FAIL",

    COLUMN_NULLABLE_ON_DATABASE_ONLY = "COLUMN_NULLABLE_ON_DATABASE_ONLY",
    COLUMN_NULLABLE_ON_APPLICATION_ONLY_INSERT_WILL_FAIL = "COLUMN_NULLABLE_ON_APPLICATION_ONLY_INSERT_WILL_FAIL",
    COLUMN_NULLABLE_ON_APPLICATION_ONLY_UPDATE_WILL_FAIL = "COLUMN_NULLABLE_ON_APPLICATION_ONLY_UPDATE_WILL_FAIL",

    COLUMN_GENERATED_ON_DATABASE_ONLY_INSERT_WILL_FAIL = "COLUMN_GENERATED_ON_DATABASE_ONLY_INSERT_WILL_FAIL",
    COLUMN_GENERATED_ON_DATABASE_ONLY_UPDATE_WILL_FAIL = "COLUMN_GENERATED_ON_DATABASE_ONLY_UPDATE_WILL_FAIL",
    COLUMN_GENERATED_AND_AUTO_INCREMENT_ON_APPLICATION = "COLUMN_GENERATED_AND_AUTO_INCREMENT_ON_APPLICATION",
    COLUMN_GENERATED_ON_APPLICATION_ONLY_INSERT_WILL_FAIL = "COLUMN_GENERATED_ON_APPLICATION_ONLY_INSERT_WILL_FAIL",

    COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_INSERT_WILL_FAIL = "COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_INSERT_WILL_FAIL",

}

export interface TableOnApplicationOnlyError {
    type : SchemaValidationErrorType.TABLE_ON_APPLICATION_ONLY,
    description : string,
    applicationTableAlias : string,
    databaseSchemaAlias : string,
}

export interface TableAliasMismatchError {
    type : SchemaValidationErrorType.TABLE_ALIAS_MISMATCH,
    description : string,
    applicationTableAlias : string,
    databaseTableAlias : string,
}

export interface PrimaryKeyOnApplicationOnlyError {
    type : SchemaValidationErrorType.PRIMARY_KEY_ON_APPLICATION_ONLY,
    description : string,
    tableAlias : string,
    primaryKey : readonly string[],
}
export interface PrimaryKeyMismatchError {
    type : SchemaValidationErrorType.PRIMARY_KEY_MISMATCH,
    description : string,
    tableAlias : string,
    applicationPrimaryKey : readonly string[],
    databasePrimaryKey : readonly string[],
}

export interface CandidateKeyOnApplicationOnlyError {
    type : SchemaValidationErrorType.CANDIDATE_KEY_ON_APPLICATION_ONLY,
    description : string,
    tableAlias : string,
    applicationCandidateKey : readonly string[],
}

export interface DatabaseTableHasNoPrimaryOrCandidateKeysError {
    type : SchemaValidationErrorType.DATABASE_TABLE_HAS_NO_PRIMARY_OR_CANDIDATE_KEY,
    description : string,
    tableAlias : string,
}

export interface ColumnOnDatabaseOnlyInsertWillFailError {
    type : SchemaValidationErrorType.COLUMN_ON_DATABASE_ONLY_INSERT_WILL_FAIL,
    description : string,
    tableAlias : string,
    databaseColumnAlias : string,
    isNullable : false,
    isAutoIncrement : false,
    generationExpression : undefined,
    explicitDefaultValue : undefined,
    insertEnabled : true,
}
export interface ColumnOnApplicationOnlyError {
    type : SchemaValidationErrorType.COLUMN_ON_APPLICATION_ONLY,
    description : string,
    tableAlias : string,
    applicationColumnAlias : string,
}


export interface AutoIncrementOnApplicationOnlyInsertWillFailError {
    type : SchemaValidationErrorType.AUTO_INCREMENT_ON_APPLICATION_ONLY_INSERT_WILL_FAIL,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface AutoIncrementMismatchInsertWillFailError {
    type : SchemaValidationErrorType.AUTO_INCREMENT_MISMATCH_INSERT_WILL_FAIL,
    description : string,
    tableAlias : string,
    applicationColumnAlias : string,
    databaseColumnAlias : string,
}

export interface ColumnAliasMismatchError {
    type : SchemaValidationErrorType.COLUMN_ALIAS_MISMATCH,
    description : string,
    tableAlias : string,
    applicationColumnAlias : string,
    databaseColumnAlias : string,
}

export interface ColumnNullableOnDatabaseOnlyError {
    type : SchemaValidationErrorType.COLUMN_NULLABLE_ON_DATABASE_ONLY,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface ColumnNullableOnApplicationOnlyInsertWillFailError {
    type : SchemaValidationErrorType.COLUMN_NULLABLE_ON_APPLICATION_ONLY_INSERT_WILL_FAIL,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface ColumnNullableOnApplicationOnlyUpdateWillFailError {
    type : SchemaValidationErrorType.COLUMN_NULLABLE_ON_APPLICATION_ONLY_UPDATE_WILL_FAIL,
    description : string,
    tableAlias : string,
    columnAlias : string,
}

export interface ColumnGeneratedOnDatabaseOnlyInsertWillFailError {
    type : SchemaValidationErrorType.COLUMN_GENERATED_ON_DATABASE_ONLY_INSERT_WILL_FAIL,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface ColumnGeneratedOnDatabaseOnlyUpdateWillFailError {
    type : SchemaValidationErrorType.COLUMN_GENERATED_ON_DATABASE_ONLY_UPDATE_WILL_FAIL,
    description : string,
    tableAlias : string,
    columnAlias : string,
}
export interface ColumnGeneratedAndAutoIncrementOnApplicationError {
    type : SchemaValidationErrorType.COLUMN_GENERATED_AND_AUTO_INCREMENT_ON_APPLICATION,
    description : string,
    tableAlias : string,
    applicationColumnAlias : string,
}
export interface ColumnGeneratedOnApplicationOnlyInsertWillFailError {
    type : SchemaValidationErrorType.COLUMN_GENERATED_ON_APPLICATION_ONLY_INSERT_WILL_FAIL,
    description : string,
    tableAlias : string,
    columnAlias : string,
}

export interface ColumnExplicitDefaultValueOnApplicationOnlyInsertWillFailError {
    type : SchemaValidationErrorType.COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_INSERT_WILL_FAIL,
    description : string,
    tableAlias : string,
    columnAlias : string,
}

export type SchemaValidationError =
    | TableOnApplicationOnlyError
    | TableAliasMismatchError

    | PrimaryKeyOnApplicationOnlyError
    | PrimaryKeyMismatchError

    | CandidateKeyOnApplicationOnlyError

    | DatabaseTableHasNoPrimaryOrCandidateKeysError

    | ColumnOnDatabaseOnlyInsertWillFailError
    | ColumnOnApplicationOnlyError

    | AutoIncrementOnApplicationOnlyInsertWillFailError
    | AutoIncrementMismatchInsertWillFailError

    | ColumnAliasMismatchError

    | ColumnNullableOnDatabaseOnlyError
    | ColumnNullableOnApplicationOnlyInsertWillFailError
    | ColumnNullableOnApplicationOnlyUpdateWillFailError

    | ColumnGeneratedOnDatabaseOnlyInsertWillFailError
    | ColumnGeneratedOnDatabaseOnlyUpdateWillFailError
    | ColumnGeneratedAndAutoIncrementOnApplicationError
    | ColumnGeneratedOnApplicationOnlyInsertWillFailError

    | ColumnExplicitDefaultValueOnApplicationOnlyInsertWillFailError
;
