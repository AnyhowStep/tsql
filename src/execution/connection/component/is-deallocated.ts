export interface IsDeallocated {
    /**
     * Tells you if the underlying connection has been returned to the pool.
     * If this connection has been deallocated,
     * attempts to use it will throw an error.
     */
    isDeallocated () : boolean;
}
