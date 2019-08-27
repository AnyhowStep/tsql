import {ColumnIdentifier} from "../../../column-identifier";
import {isEqual} from "../../util";

export function assertNoDuplicate (
    arr : readonly ColumnIdentifier[]
) {
    for (let i=0; i<arr.length; ++i) {
        for (let j=i+1; j<arr.length; ++j) {
            if (isEqual(arr[i], arr[j])) {
                throw new Error(`Duplicate column identifier ${arr[i].tableAlias}.${arr[i].columnAlias}`);
            }
        }
    }
}
