export class RowNotFoundError extends Error {
    /**
     * The SQL string that caused this error.
     *
     * + We assign to it using `defineProperty`.
     * + It is non-enumerable.
     */
    readonly sql! : string;
    constructor (message : string, sql : string) {
        super(message);
        Object.setPrototypeOf(this, RowNotFoundError.prototype);
        Object.defineProperty(this, "sql", {
            value : sql,
            enumerable : false,
            writable : true,
        });
    }
}
RowNotFoundError.prototype.name = "RowNotFoundError";

export class TooManyRowsFoundError extends Error {
    /**
     * The SQL string that caused this error.
     *
     * + We assign to it using `defineProperty`.
     * + It is non-enumerable.
     */
    readonly sql! : string;
    constructor (message : string, sql : string) {
        super(message);
        Object.setPrototypeOf(this, TooManyRowsFoundError.prototype);
        Object.defineProperty(this, "sql", {
            value : sql,
            enumerable : false,
            writable : true,
        });
    }
}
TooManyRowsFoundError.prototype.name = "TooManyRowsFoundError";

export class NoColumnsSelectedError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, NoColumnsSelectedError.prototype);
    }
}
NoColumnsSelectedError.prototype.name = "NoColumnsSelectedError";

export class TooManyColumnsSelectedError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, TooManyColumnsSelectedError.prototype);
    }
}
TooManyColumnsSelectedError.prototype.name = "TooManyColumnsSelectedError";

export class TooManyRowsUpdatedError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, TooManyRowsUpdatedError.prototype);
    }
}
TooManyRowsUpdatedError.prototype.name = "TooManyRowsUpdatedError";

export class CannotCountError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, CannotCountError.prototype);
    }
}
CannotCountError.prototype.name = "CannotCountError";
