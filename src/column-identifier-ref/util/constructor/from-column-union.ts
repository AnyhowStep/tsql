import {ColumnIdentifierMapUtil} from "../../../column-identifier-map";
import {ColumnIdentifierUtil} from "../../../column-identifier";
import {ColumnIdentifier} from "../../../column-identifier/column-identifier";

export type FromColumnUnion<ColumnT extends ColumnIdentifier> = (
    {
        readonly [tableAlias in ColumnT["tableAlias"]] : (
            ColumnIdentifierMapUtil.FromColumnUnion<
                ColumnIdentifierUtil.ExtractWithTableAlias<ColumnT, tableAlias>
            >
        )
    }
);
