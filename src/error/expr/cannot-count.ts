import {SqlError, SqlErrorArgs} from "../sql-error";

export class CannotCountError extends SqlError {
    constructor (args : SqlErrorArgs) {
        super(args);
        Object.setPrototypeOf(this, CannotCountError.prototype);
    }
}
CannotCountError.prototype.name = "CannotCountError";
