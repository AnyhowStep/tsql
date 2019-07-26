import * as tm from "type-mapping";
import {CandidateKey} from "../../candidate-key";
import {ITable} from "../../../table";
import {ColumnMapUtil} from "../../../column-map";
import {pickOwnEnumerable} from "../../../type-util";

export type Mapper<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    tm.SafeMapper<CandidateKey<TableT>>
);
export function mapper<TableT extends Pick<ITable, "columns"|"candidateKeys">> (
    table : TableT
) : (
    Mapper<TableT>
) {
    return tm.unsafeOr(
        ...table.candidateKeys.map((candidateKey) => {
            return ColumnMapUtil.mapper(
                pickOwnEnumerable(table.columns, candidateKey)
            );
        })
    ) as any;
}