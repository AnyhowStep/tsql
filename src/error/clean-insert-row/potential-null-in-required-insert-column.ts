import {SqlError} from "../sql-error";
import {ITable} from "../../table";

export interface PotentialNullInRequiredInsertColumnErrorArgs {
    readonly message : string,
    readonly table : ITable;
    readonly columnAlias : string;
}

export class PotentialNullInRequiredInsertColumnError extends SqlError {
    readonly table : ITable;
    readonly columnAlias : string;

    constructor (args : PotentialNullInRequiredInsertColumnErrorArgs) {
        super({
            message : args.message,
            sql : undefined,
        });
        Object.setPrototypeOf(this, PotentialNullInRequiredInsertColumnError.prototype);

        this.table = args.table;
        this.columnAlias = args.columnAlias;
    }
}
PotentialNullInRequiredInsertColumnError.prototype.name = "PotentialNullInRequiredInsertColumnError";
