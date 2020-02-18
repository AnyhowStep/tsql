import {SqlError, SqlErrorArgs} from "../sql-error";

export class TooManyRowsFoundError extends SqlError {
    readonly sql : string;

    constructor (args : SqlErrorArgs & { readonly sql : string }) {
        super(args);
        Object.setPrototypeOf(this, TooManyRowsFoundError.prototype);
        this.sql = args.sql;
    }
}
TooManyRowsFoundError.prototype.name = "TooManyRowsFoundError";
