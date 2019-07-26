import {ColumnIdentifier, ColumnIdentifierUtil} from "../../../column-identifier";
import {ColumnMap} from "../../../column-map";

export type FromColumnMap<ColumnMapT extends ColumnMap> = (
    {
        readonly [columnAlias in Extract<keyof ColumnMapT, string>] : (
            ColumnIdentifierUtil.FromColumn<ColumnMapT[columnAlias]>
        )
    }
);
export function fromColumnMap<ColumnMapT extends ColumnMap> (
    columnMap : ColumnMapT
) : FromColumnMap<ColumnMapT> {
    return Object.keys(columnMap).reduce<{
        [columnAlias : string] : ColumnIdentifier
    }>(
        (memo, columnAlias) => {
            memo[columnAlias] = ColumnIdentifierUtil.fromColumn(columnMap[columnAlias]);
            return memo;
        },
        {}
    ) as FromColumnMap<ColumnMapT>;
}