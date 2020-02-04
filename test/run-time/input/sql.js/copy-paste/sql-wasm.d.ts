
/**
 * http://kripken.github.io/sql.js/documentation/#http://kripken.github.io/sql.js/documentation/class/Statement.html
 */
interface PreparedStatement {
    /*
        Copy-pasted from,
        https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/sql.js/module.d.ts

        Too lazy to test prepared statements for now.
    */
    /**
     * Bind values to the parameters, after having reseted the statement
     *
     * SQL statements can have parameters, named '?', '?NNN', ':VVV', '@VVV', '$VVV',
     * where NNN is a number and VVV a string.
     *
     * This function binds these parameters to the given values.
     *
     * Warning: ':', '@', and '$' are included in the parameters names
     */
    bind(): boolean;
    bind(values: ParamsObject): boolean;
    bind(values: ColumnValue[]): boolean;

    /**
     * Execute the statement, fetching the the next line of result, that can be retrieved with Statement.get() .
     */
    step(): boolean;

    /**
     * Get one row of results of a statement. If the first parameter is not provided, step must have been called before get.
     */
    get(): ColumnValue[];
    get(params: ParamsObject): ColumnValue[];
    get(params: ColumnValue[]): ColumnValue[];

    /**
     * Get the list of column names of a row of result of a statement.
     */
    getColumnNames(): string[];

    /**
     * Get one row of result as a javascript object, associating column names with their value in the current row.
     */
    getAsObject(): ParamsObject;
    getAsObject(params: ParamsObject): ParamsObject;
    getAsObject(params: ColumnValue[]): ParamsObject;

    /**
     * Shorthand for bind + step + reset Bind the values, execute the statement,
     * ignoring the rows it returns, and resets it
     */
    run(): void;
    run(values: ParamsObject): void;
    run(values: ColumnValue[]): void;

    /**
     * Reset a statement, so that it's parameters can be bound to new values It also
     * clears all previous bindings, freeing the memory used by bound parameters.
     */
    reset(): void;

    /**
     * Free the memory allocated during parameter binding
     */
    freemem(): void;

    /**
     * Free the memory used by the statement
     *
     * You can not use your statement anymore once it has been freed.
     *
     * But not freeing your statements causes memory leaks. You don't want that.
     */
    free(): boolean;
}
/**
 * https://www.sqlite.org/datatype3.html
 */
export type ColumnValue =
    /**
     * INTEGER/REAL
     *
     * + The `true` boolean is `1`
     * + The `false` boolean is `0`
     */
    | number
    /**
     * TEXT
     */
    | string
    /**
     * BLOB
     */
    | Uint8Array
    /**
     * NULL
     */
    | null
;
export type Row = ColumnValue[];
export interface ResultSet {
    columns : string[],
    values : Row[],
}
export type ExecResult = ResultSet[];
export type ParamsObject = Record<string, ColumnValue>;
/**
 * http://kripken.github.io/sql.js/documentation/#http://kripken.github.io/sql.js/documentation/class/Database.html
 */
export interface Database {
    /**
     * Execute an SQL query, ignoring the rows it returns.
     */
    run (sql : string) : this;
    /**
     * Execute an SQL query, ignoring the rows it returns.
     *
     * If you use the params argument, you cannot provide an sql string that contains several queries (separated by ';')
     *
     * ```ts
     *  db.run("INSERT INTO test VALUES (:age, :name)", {':age':18, ':name':'John'});
     * ```
     */
    run (sql : string, params : ParamsObject) : this;
    /**
     * Execute an SQL query, and returns the result.
     */
    exec (sql : string) : ExecResult;
    /**
     * Execute an sql statement, and call a callback for each row of result.
     */
    each (
        sql : string,
        params : ParamsObject,
        callback : (row : ParamsObject) => void,
        done : () => void
    ) : void;
    /**
     * Prepare an SQL statement
     */
    prepare (
        sql : string,
        params? : ParamsObject
    ) : PreparedStatement;
    /**
     * Exports the contents of the database to a binary array
     */
    export () : Uint8Array;
    /**
     * Close the database, and all associated prepared statements.
     */
    close () : void;
    /**
     * Returns the number of rows modified, inserted or deleted by the most recently completed
     * `INSERT`, `UPDATE` or `DELETE` statement on the database.
     *
     * Executing any other type of SQL statement does not modify the value returned by this function.
     */
    getRowsModified () : number;
    /**
     * Register a custom function with SQLite
     */
    create_function (functionName : string, options : { isVarArg? : boolean, }, impl : (...args : unknown[]) => unknown) : this;
    create_aggregate<StateT> (
        functionName : string,
        init : () => StateT,
        step : (state : StateT, ...args : unknown[]) => void,
        finalize : (state : StateT) => unknown
    ) : this;

}
export interface Sqlite {
    Database : new (dbFile? : Uint8Array) => Database;
}
declare const initSqlJs : () => Promise<Sqlite>;
export default initSqlJs;
