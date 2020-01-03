export interface IsInTransaction<ConnectionT> {
    /**
     * Tells you if this connection is in a transaction.
     */
    isInTransaction () : this is ConnectionT;
}
