import {ColumnIdentifierUtil} from "../../../column-identifier";
import {ColumnIdentifier} from "../../../column-identifier/column-identifier";

export type FromColumnUnion<ColumnT extends ColumnIdentifier> = (
    {
        readonly [columnAlias in ColumnT["columnAlias"]] : (
            ColumnIdentifierUtil.FromColumn<
                ColumnIdentifierUtil.ExtractWithColumnAlias<ColumnT, columnAlias>
            >
        )
    }
);
