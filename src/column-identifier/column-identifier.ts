/**
 * Contains enough information to identify a column within a database.
 *
 * Does not contain the column's type.
 */
export interface ColumnIdentifier {
    readonly tableAlias : string;
    readonly columnAlias : string;
}
