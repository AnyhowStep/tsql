import * as tm from "type-mapping";
import {SuperKey_Output} from "../../super-key";
import {ITable} from "../../../table";
import {ColumnMapUtil} from "../../../column-map";
import {pickOwnEnumerable, omitOwnEnumerable} from "../../../type-util";

export type Mapper<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    tm.SafeMapper<SuperKey_Output<TableT>>
);
export function mapper<TableT extends Pick<ITable, "columns"|"candidateKeys">> (
    table : TableT
) : (
    Mapper<TableT>
) {
    return tm.unsafeOr(
        ...table.candidateKeys.map((candidateKey) => {
            /**
             * This usage of `tm.deepMerge()` is safe.
             * This is not true, in general.
             *
             * The two objects we'll be deep merging do not share any
             * properties.
             */
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
