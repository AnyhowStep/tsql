declare global {
    const Buffer : {
        isBuffer : (mixed : unknown) => mixed is Buffer,
    };
    interface Buffer {
        equals : (other : Buffer) => boolean,
        toString : (encoding : "hex") => string,
    }
}
export {};
