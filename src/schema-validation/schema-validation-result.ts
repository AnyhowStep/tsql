import {SchemaValidationError} from "./schema-validation-error";
import {SchemaValidationWarning} from "./schema-validation-warning";

export interface WritableSchemaValidationResult {
    warnings : SchemaValidationWarning[],
    errors : SchemaValidationError[],
}

export interface SchemaValidationResult {
    warnings : readonly SchemaValidationWarning[],
    errors : readonly SchemaValidationError[],
}
