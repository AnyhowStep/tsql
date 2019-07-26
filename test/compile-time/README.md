### Note

This project is meant to provide compile-time safety when working with MySQL databases.

This means we have a few compile-time requirements,

+ Correct code should compile *with the right types*
+ Incorrect code should not compile *with the right errors*

-----

### Correct code should compile *with the right types*

An example of compiling with the right types would be,

Given this input,

```ts
import * as sd from "schema-decorator";
import * as o from "typed-orm";

export const t = o.table(
    "someTableName",
    {
        x : sd.naturalNumber(),
        y : sd.naturalNumber(),
    }
);
```

If we get this output,

```ts
import * as sd from "schema-decorator";
import * as o from "typed-orm";

export declare const t: o.Table<{
    readonly alias: string;
    readonly name: string;
/*snip*/
```

Then we fail the test because `alias` and `name` should be of type `"someTableName"`, the string literal!

-----

### Incorrect code should not compile *with the right errors*

Given this input,

```ts
import * as sd from "schema-decorator";
import * as o from "typed-orm";

export const t = o.table(
    232,
    {
        x : sd.naturalNumber(),
        y : sd.naturalNumber(),
    }
);
```

We expect this output,

```json
{
    "messageText": "Argument of type '232' is not assignable to parameter of type 'string'.",
    "code": 2345,
    "category": 1,
    "length": 3,
    "start": 232
}
```

If we get something else, we fail the test.

-----

### Implementing Tests

1. Write the input `.ts` file in the `input` folder
2. Run `npm run test-compile-time`

You may get errors about expected output being missing, or the actual and expected output being different.

You can now do one of the following,

+ Fix the code, and run the test again
+ Accept that this "actual" output is, in fact, correct.

If it is correct, run `npm run accept-compile-time`