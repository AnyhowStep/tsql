/**
 * For now, it only has enough information that we can validate the table declarations.
 *
 * In the future, we should modify this to have enough information
 * to generate the table declarations.
 */
export interface ColumnMeta {
    columnAlias : string,

    isAutoIncrement : boolean,
    isNullable : boolean,
    /**
     * If `undefined`, there is no explicit default value.
     */
    explicitDefaultValue : string|undefined,
    /**
     * If `undefined`, there is no generation expression.
     */
    generationExpression : string|undefined,
}
