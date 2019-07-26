import {ITable} from "../table";
import {ColumnMap} from "../column-map";
import {TypeMapUtil} from "../type-map";
import {Key} from "../key";
import {CandidateKeyImpl} from "../candidate-key";

export type SuperKeyImpl<MapT extends ColumnMap, K extends Key> = (
    K extends Key ?
    CandidateKeyImpl<MapT, K> &
    Partial<
        TypeMapUtil.FromColumnMap<
            Omit<MapT, K[number]>
        >
    > :
    never
);
export type SuperKey<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    SuperKeyImpl<
        TableT["columns"],
        TableT["candidateKeys"][number]
    >
);