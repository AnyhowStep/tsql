export declare const resultSet: Promise<{
    hello: string;
    test: {
        readonly testId: bigint;
        readonly testVal: bigint;
    };
    other2: {
        readonly testId: bigint;
        readonly otherVal: bigint;
    };
    total: bigint;
}[]>;
