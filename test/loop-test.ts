import * as tm from "type-mapping";
import * as tape from "tape";

export type Expected =
    | {
        shouldError : true,
    }
    | {
        shouldError : false,
        value : unknown,
    }
;
export async function loopTest (
    fileName : string,
    t : tape.Test,
    start : number,
    end : number,
    step : number,
    actualCallback : (x : number) => Promise<unknown>,
    expectedCallback : (x : number) => Expected
) {
    for (let x=start; x<end; x+=step) {
        const expected = expectedCallback(x);
        const isOk : boolean = await actualCallback(x)
            .then((actual) => {
                if (expected.shouldError) {
                    t.fail(`${fileName}; ${x} should error; ${actual}`);
                    return false;
                } else {
                    if (tm.TypeUtil.strictEqual(actual, expected)) {
                        //t.pass();
                        return true;
                    } else {
                        t.deepEqual(actual, expected.value, `${fileName}; ${x}`);
                        t.fail(`${fileName}; ${x}; actual ${actual}; expected; ${expected.value}`);
                        return false;
                    }

                }
            })
            .catch((err) => {
                if (expected.shouldError) {
                    //t.pass();
                    return true;
                } else {
                    t.fail(`${fileName}; ${x} should not error; ${err.message}`);
                    return false;
                }
            });
        if (!isOk) {
            return;
        }
    }
}

export async function loopTest2 (
    fileName : string,
    t : tape.Test,
    start : number,
    end : number,
    step : number,
    actualCallback : (x : number, y : number) => Promise<unknown>,
    expectedCallback : (x : number, y : number) => Expected
) {
    for (let x=start; x<end; x+=step) {
        for (let y=start; y<end; y+=step) {
            const expected = expectedCallback(x, y);
            const isOk : boolean = await actualCallback(x, y)
                .then((actual) => {
                    if (expected.shouldError) {
                        t.fail(`${fileName}; ${x}, ${y} should error; ${actual}`);
                        return false;
                    } else {
                        if (tm.TypeUtil.strictEqual(actual, expected.value)) {
                            //t.pass();
                            return true;
                        } else {
                            t.deepEqual(actual, expected.value, `${fileName}; ${x}, ${y}`);
                            t.fail(`${fileName}; ${x}, ${y}; actual ${actual}; expected; ${expected.value}`);
                            return false;
                        }

                    }
                })
                .catch((err) => {
                    if (expected.shouldError) {
                        //t.pass();
                        return true;
                    } else {
                        t.fail(`${fileName}; ${x}, ${y} should not error;\n${err.message};\n${err.sql}`);
                        return false;
                    }
                });
            if (!isOk) {
                return;
            }
        }
    }
}
