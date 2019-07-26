import * as tm from "type-mapping";
import {SuperKey} from "../../super-key";
import {ITable} from "../../../table";
import {ColumnMapUtil} from "../../../column-map";
import {pickOwnEnumerable, omitOwnEnumerable} from "../../../type-util";

export type Mapper<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    tm.SafeMapper<SuperKey<TableT>>
);
export function mapper<TableT extends Pick<ITable, "columns"|"candidateKeys">> (
    table : TableT
) : (
    Mapper<TableT>
) {
    return tm.unsafeOr(
        ...table.candidateKeys.map((candidateKey) => {
            return tm.deepMerge(
                ColumnMapUtil.mapper(
                    pickOwnEnumerable(table.columns, candidateKey)
                ),
                ColumnMapUtil.partialMapper(
                    omitOwnEnumerable(table.columns, candidateKey)
                )
            );
        })
    ) as any;
}