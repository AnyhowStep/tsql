export class RowNotFoundError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, RowNotFoundError.prototype);
    }
}

export class TooManyRowsFoundError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, TooManyRowsFoundError.prototype);
    }
}

export class NoColumnsSelectedError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, RowNotFoundError.prototype);
    }
}

export class TooManyColumnsSelectedError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, RowNotFoundError.prototype);
    }
}

export class TooManyRowsUpdatedError extends Error {
    constructor (message : string) {
        super(message);
        Object.setPrototypeOf(this, TooManyRowsUpdatedError.prototype);
    }
}