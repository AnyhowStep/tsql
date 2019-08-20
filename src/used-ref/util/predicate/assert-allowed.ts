import {IUsedRef} from "../../used-ref";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {ColumnIdentifierArrayUtil} from "../../../column-identifier";

/**
 * @todo Better naming
 *
 * @param allowed - Which references are allowed
 * @param used - Which references were actually used
 */
export function assertAllowed (
    allowed : Pick<IUsedRef, "columns">,
    used : Pick<IUsedRef, "columns">
) {
    ColumnIdentifierRefUtil.assertHasColumnIdentifiers(
        allowed.columns,
        ColumnIdentifierArrayUtil.fromColumnRef(used.columns)
    );
}
