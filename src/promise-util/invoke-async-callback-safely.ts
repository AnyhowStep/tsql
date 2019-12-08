
export async function invokeAsyncCallbackSafely<T, U> (
    asyncCallback : () => PromiseLike<T>,
    thenCallback : (t : T) => U | PromiseLike<U>,
    catchCallback : (err : any) => U | PromiseLike<U>
) : Promise<U> {
    try {
        return asyncCallback()
            .then(
                thenCallback,
                catchCallback
            );
    } catch (syncErr) {
        return catchCallback(syncErr);
    }
}
