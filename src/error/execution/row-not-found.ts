import {SqlError, SqlErrorArgs} from "../sql-error";

export class RowNotFoundError extends SqlError {
    readonly sql : string;

    constructor (args : SqlErrorArgs & { readonly sql : string }) {
        super(args);
        Object.setPrototypeOf(this, RowNotFoundError.prototype);
        this.sql = args.sql;
    }
}
RowNotFoundError.prototype.name = "RowNotFoundError";
