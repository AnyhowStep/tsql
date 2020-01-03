import {SchemaMeta} from "../../../schema-introspection";

export interface TryFetchSchemaMeta {
    /**
     *
     * @param schemaAlias - If `undefined`, it uses the implied schema of the connection
     */
    tryFetchSchemaMeta (schemaAlias : string|undefined) : Promise<SchemaMeta|undefined>;
}
