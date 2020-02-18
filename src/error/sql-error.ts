/**
 * Used to wrap and rethrow an `innerError`
 */
export interface WrappedSqlErrorArgs {
    readonly sql : string|undefined,
    readonly innerError : unknown,
}

/**
 * Used when there is no `innerError` to wrap and throw
 */
export interface MessageSqlErrorArgs {
    readonly message : string|undefined,
    readonly sql : string|undefined,
}

export type SqlErrorArgs =
    | WrappedSqlErrorArgs
    | MessageSqlErrorArgs
;

/**
 * All errors in this library should extend this class.
 */
export class SqlError extends Error {
    /**
     * The SQL string that caused this error.
     *
     * May be `undefined`.
     */
    readonly sql : string|undefined;
    /**
     * The error that caused this error to be thrown.
     * Generally comes from the database driver library.
     *
     * May be `undefined`, may be any throwable value.
     */
    readonly innerError : unknown;

    constructor (args : SqlErrorArgs) {
        super(
            "innerError" in args ?
            (
                args.innerError instanceof Object && "message" in args.innerError ?
                (args.innerError as any).message :
                String(args.innerError)
            ) :
            args.message
        );
        if ("innerError" in args && args.innerError instanceof Object && "stack" in args.innerError) {
            this.stack += `\n${(args.innerError as any).stack}`;
        }
        Object.setPrototypeOf(this, SqlError.prototype);
        this.sql = args.sql;
        this.innerError = (
            "innerError" in args ?
            args.innerError :
            undefined
        );
    }
}
SqlError.prototype.name = "SqlError";
