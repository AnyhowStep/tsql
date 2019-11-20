import * as tm from "type-mapping";
import {CandidateKey_Output} from "../../candidate-key";
import {ITable} from "../../../table";
import {ColumnMapUtil} from "../../../column-map";
import {pickOwnEnumerable} from "../../../type-util";
import {PrimaryKeyUtil} from "../../../primary-key";

export type Mapper<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    tm.SafeMapper<CandidateKey_Output<TableT>>
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

export function mapperPreferPrimaryKey<TableT extends Pick<ITable, "columns"|"candidateKeys"|"primaryKey">> (
    table : TableT
) : (
    Mapper<TableT>
) {
    if (table.primaryKey == undefined) {
        return mapper(table);
    }

    return tm.unsafeOr(
        PrimaryKeyUtil.mapper(table as TableT & { primaryKey : Exclude<TableT["primaryKey"], undefined> }),
        mapper(table)
    ) as any;
}
