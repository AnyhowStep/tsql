import {SqlError} from "../sql-error";
import {ITable} from "../../table";

export interface MissingRequiredInsertColumnErrorArgs {
    readonly message : string,
    readonly table : ITable;
    readonly columnAlias : string;
}

export class MissingRequiredInsertColumnError extends SqlError {
    readonly table : ITable;
    readonly columnAlias : string;

    constructor (args : MissingRequiredInsertColumnErrorArgs) {
        super({
            message : args.message,
            sql : undefined,
        });
        Object.setPrototypeOf(this, MissingRequiredInsertColumnError.prototype);

        this.table = args.table;
        this.columnAlias = args.columnAlias;
    }
}
MissingRequiredInsertColumnError.prototype.name = "MissingRequiredInsertColumnError";
