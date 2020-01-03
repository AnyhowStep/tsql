export interface TryFetchGeneratedColumnExpression {
    /**
     *
     * @param schemaAlias - If `undefined`, it uses the implied schema of the connection
     * @param tableAlias
     * @param columnAlias
     *
     * @returns A SQL string that is the generated column's expression
     */
    tryFetchGeneratedColumnExpression (
        schemaAlias : string|undefined,
        tableAlias : string,
        columnAlias : string
    ) : Promise<string|undefined>;
}
