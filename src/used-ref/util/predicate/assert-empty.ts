import {IUsedRef} from "../../used-ref";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {ColumnIdentifierArrayUtil} from "../../../column-identifier";

/**
 * @todo Better naming
 *
 * @param used - Which references were actually used
 */
export function assertEmpty (
    used : Pick<IUsedRef, "columns">
) {
    ColumnIdentifierRefUtil.assertHasColumnIdentifiers(
        {},
        ColumnIdentifierArrayUtil.fromColumnRef(used.columns)
    );
}
