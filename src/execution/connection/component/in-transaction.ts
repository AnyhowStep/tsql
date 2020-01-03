import {IsolationLevel} from "../../../isolation-level";
import {TransactionAccessMode} from "../../../transaction-access-mode";

export interface InTransaction {
    rollback () : Promise<void>;
    commit () : Promise<void>;

    getMinimumIsolationLevel () : IsolationLevel;
    getTransactionAccessMode () : TransactionAccessMode;
}
