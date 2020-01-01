/**
 * Transaction access modes ranked from least to most permissive,
 * 1. `READ_ONLY`
 * 2. `READ_WRITE`
 *
 * https://github.com/AnyhowStep/tsql/issues/14
 */
export enum TransactionAccessMode {
    READ_ONLY = "READ_ONLY",
    READ_WRITE = "READ_WRITE",
}

export namespace TransactionAccessModeUtil {
    const transactionAccessModePermissions = {
        [TransactionAccessMode.READ_ONLY]  : 0,
        [TransactionAccessMode.READ_WRITE] : 1,
    } as const;
    /**
     * Is transaction access mode `a` less permissive than `b`?
     */
    export function isLessPermissiveThan (a : TransactionAccessMode, b : TransactionAccessMode) : boolean {
        return transactionAccessModePermissions[a] < transactionAccessModePermissions[b];
    }
}
