import {ITable} from "../table";
import {ColumnMap} from "../column-map";
import {TypeMapUtil} from "../type-map";
import {Key} from "../key";

export type CandidateKeyImpl<MapT extends ColumnMap, K extends Key> = (
    K extends Key ?
    TypeMapUtil.FromColumnMap<
        Pick<MapT, K[number]>
    > :
    never
);
export type CandidateKey<TableT extends Pick<ITable, "columns"|"candidateKeys">> = (
    CandidateKeyImpl<
        TableT["columns"],
        TableT["candidateKeys"][number]
    >
);