/**
 * Isolation levels ranked from weakest to strongest,
 * 1. `READ_UNCOMMITTED`
 * 2. `READ_COMMITTED`
 * 3. `REPEATABLE_READ`
 * 4. `SERIALIZABLE`
 *
 * https://github.com/AnyhowStep/tsql/issues/14
 */
export enum IsolationLevel {
    READ_UNCOMMITTED = "READ_UNCOMMITTED",
    READ_COMMITTED   = "READ_COMMITTED",
    REPEATABLE_READ  = "REPEATABLE_READ",
    SERIALIZABLE     = "SERIALIZABLE",
}

export namespace IsolationLevelUtil {
    const isolationLevelStrengths = {
        [IsolationLevel.READ_UNCOMMITTED] : 0,
        [IsolationLevel.READ_COMMITTED]   : 1,
        [IsolationLevel.REPEATABLE_READ]  : 2,
        [IsolationLevel.SERIALIZABLE]     : 3,
    } as const;
    /**
     * Is isolation level `a` weaker than `b`?
     */
    export function isWeakerThan (a : IsolationLevel, b : IsolationLevel) : boolean {
        return isolationLevelStrengths[a] < isolationLevelStrengths[b];
    }
}
