import {ColumnIdentifier} from "../../../column-identifier";
import {isEqual} from "../../util";

export function assertDisjoint (
    arrA : readonly ColumnIdentifier[],
    arrB : readonly ColumnIdentifier[]
) {
    for (const a of arrA) {
        for (const b of arrB) {
            if (isEqual(a, b)) {
                throw new Error(`Duplicate column identifier ${a.tableAlias}.${a.columnAlias} found; consider aliasing`);
            }
        }
    }
}
